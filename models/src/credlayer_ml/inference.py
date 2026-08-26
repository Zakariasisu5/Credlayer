"""Production inference module for the standalone CredLayer ML service.
"""
from typing import Any, Dict, List, Optional

import structlog
import torch

from credlayer_ml.config import PipelineConfig, get_default_config
from credlayer_ml.data.graph_builder import load_graph
from credlayer_ml.models.fraud_gnn import FraudGNN

try:
    from credlayer_ml.models.explainer import FraudExplainer
    HAS_EXPLAINER = True
except ImportError:
    HAS_EXPLAINER = False

logger = structlog.get_logger(__name__)


class FraudScorer:
    """Inference scorer for predicting fraud probability of wallet addresses."""
    
    def __init__(self, config: Optional[PipelineConfig] = None):
        self.config = config or get_default_config()
        self.device = torch.device('cpu')
        self.model: Optional[FraudGNN] = None
        self.graph = None
        self.node_to_idx: Dict[str, int] = {}
        self.explainer = None
        self._is_loaded = False
        
    def _load(self) -> None:
        """Lazy-loads model and graph on first call if available."""
        if self._is_loaded:
            return
            
        if not self.config.paths.graph_path.exists():
            logger.warning(
                "Graph file not found on disk. Run data pipeline and training first.",
                path=str(self.config.paths.graph_path),
            )
            self._is_loaded = True
            return

        try:
            logger.info("Loading graph for inference...")
            self.graph = load_graph(self.config).to(self.device)
            self.config.model.in_features = self.graph.num_node_features
            
            if hasattr(self.graph, 'address') and self.graph.address:
                for i, addr in enumerate(self.graph.address):
                    self.node_to_idx[addr] = i
            else:
                logger.warning("Graph does not have 'address' attribute. Address lookup will fallback to default.")
            
            logger.info("Loading model for inference...")
            self.model = FraudGNN(self.config.model).to(self.device)
            if self.config.paths.best_model_path.exists():
                self.model.load_state_dict(
                    torch.load(self.config.paths.best_model_path, map_location=self.device, weights_only=True)
                )
                logger.info("Trained model checkpoint loaded successfully.")
            else:
                logger.warning("No model checkpoint found. Inference will use untrained weights.")
                
            self.model.eval()
            
            if HAS_EXPLAINER:
                self.explainer = FraudExplainer(self.model)
        except Exception as exc:
            logger.error("Failed to initialize GNN inference engine", error=str(exc))
            
        self._is_loaded = True

    def _get_trust_level(self, trust_score: int) -> str:
        if trust_score <= 250:
            return 'critical'
        elif trust_score <= 500:
            return 'low'
        elif trust_score <= 750:
            return 'medium'
        else:
            return 'high'
            
    def _get_risk_level(self, trust_level: str) -> str:
        inverse_map = {
            'critical': 'high',
            'low': 'medium',
            'medium': 'low',
            'high': 'minimal'
        }
        return inverse_map.get(trust_level, 'unknown')

    def score_address(self, address: str) -> dict:
        """Score a single wallet address."""
        self._load()
        
        # If graph or model is not compiled/loaded yet
        if self.graph is None or not self.node_to_idx:
            return {
                "address": address,
                "trust_score": 500,
                "risk_level": "medium",
                "trust_level": "low",
                "confidence": 0.0,
                "fraud_probability": 0.5,
                "network": "solana",
                "explanation": "GNN graph and model not compiled yet. Run training pipeline to generate predictions."
            }

        node_idx = self.node_to_idx.get(address)
        
        if node_idx is None:
            return {
                "address": address,
                "trust_score": 500,
                "risk_level": "medium",
                "trust_level": "low",
                "confidence": 0.1,
                "fraud_probability": 0.5,
                "network": "solana",
                "explanation": "Address not found in graph. Default score assigned."
            }
            
        with torch.no_grad():
            if hasattr(self.model, 'predict_proba'):
                probs = self.model.predict_proba(self.graph.x, self.graph.edge_index, self.graph.edge_attr)
                p_fraud = probs[node_idx, 1].item()
            else:
                logits = self.model(self.graph.x, self.graph.edge_index, self.graph.edge_attr)
                probs = torch.softmax(logits[node_idx], dim=-1)
                p_fraud = probs[1].item()
            
        trust_score = int((1 - p_fraud) * 1000)
        trust_level = self._get_trust_level(trust_score)
        risk_level = self._get_risk_level(trust_level)
        
        explanation = "Score derived from GNN graph topology and behavioral signals."
        if HAS_EXPLAINER and self.explainer is not None:
            try:
                exp = self.explainer.explain_node(node_idx, self.graph.x, self.graph.edge_index)
                if isinstance(exp, dict) and "summary" in exp:
                    explanation = exp["summary"].replace("\n", " ")
                else:
                    explanation = str(exp)
            except Exception as e:
                logger.warning(f"Failed to generate explanation: {e}")
                
        return {
            "address": address,
            "trust_score": trust_score,
            "risk_level": risk_level,
            "trust_level": trust_level,
            "confidence": 0.9,
            "fraud_probability": float(p_fraud),
            "network": "solana",
            "explanation": explanation
        }
        
    def score_batch(self, addresses: List[str]) -> List[dict]:
        """Batch scoring for multiple addresses."""
        return [self.score_address(addr) for addr in addresses]


# Module-level singleton
_scorer: Optional[FraudScorer] = None


def get_scorer() -> FraudScorer:
    """Get the singleton instance of FraudScorer."""
    global _scorer
    if _scorer is None:
        _scorer = FraudScorer()
    return _scorer
