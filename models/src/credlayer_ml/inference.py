"""Production inference module for the standalone CredLayer ML service.
"""
from typing import Any, Dict, List, Optional

import asyncio

import structlog
import torch

torch.set_num_threads(1)

from credlayer_ml.config import PipelineConfig, get_default_config
from credlayer_ml.data.graph_builder import load_graph
from credlayer_ml.data.live_features import build_live_graph
from credlayer_ml.data.live_rpc import fetch_live_context
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
        self.device = torch.device("cpu")
        self.model: Optional[FraudGNN] = None
        self.graph: Any = None
        self.node_to_idx: Dict[str, int] = {}
        self.explainer: Any = None
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
            graph = load_graph(self.config)
            if graph is None:
                raise ValueError("Graph loader returned None.")

            self.graph = graph.to(self.device)
            self.config.model.in_features = self.graph.num_node_features
            self.node_to_idx.clear()

            if hasattr(self.graph, "address") and self.graph.address is not None:
                addresses = self.graph.address
                if isinstance(addresses, torch.Tensor):
                    addresses = addresses.tolist()

                for i, addr in enumerate(addresses):
                    if addr is None:
                        continue
                    self.node_to_idx[str(addr)] = i
            else:
                logger.warning(
                    "Graph does not have 'address' attribute. Address lookup will fallback to default."
                )

            logger.info("Loading model for inference...")
            if not self.config.paths.best_model_path.exists():
                logger.error(
                    "Trained model checkpoint not found.",
                    path=str(self.config.paths.best_model_path),
                )
                self._is_loaded = True
                return

            model = FraudGNN(self.config.model).to(self.device)
            checkpoint = torch.load(
                self.config.paths.best_model_path,
                map_location=self.device,
                weights_only=True,
            )

            if isinstance(checkpoint, dict) and "model_state_dict" in checkpoint:
                checkpoint = checkpoint["model_state_dict"]
            if isinstance(checkpoint, dict) and not any(
                key.startswith("conv") or key.startswith("lin") or key.startswith("bn")
                for key in checkpoint
            ):
                checkpoint = checkpoint.get("state_dict", checkpoint)

            model.load_state_dict(checkpoint)
            self.model = model
            logger.info("Trained model checkpoint loaded successfully.")

            self.model.eval()

            if HAS_EXPLAINER:
                self.explainer = FraudExplainer(self.model)
        except Exception as exc:
            logger.error("Failed to initialize GNN inference engine", error=str(exc))
            self.model = None
            self.graph = None

        self._is_loaded = True

    def _get_trust_level(self, trust_score: int) -> str:
        if trust_score <= 250:
            return "critical"
        if trust_score <= 500:
            return "low"
        if trust_score <= 750:
            return "medium"
        return "high"

    def _get_risk_level(self, trust_level: str) -> str:
        inverse_map = {
            "critical": "high",
            "low": "medium",
            "medium": "low",
            "high": "minimal",
        }
        return inverse_map.get(trust_level, "unknown")

    async def score_address(self, address: str) -> dict:
        """Score a single wallet address."""
        self._load()

        if self.graph is None or self.model is None:
            raise RuntimeError("Trained scoring artifacts are unavailable.")

        inference_graph = self.graph
        node_idx = self.node_to_idx.get(address)
        if node_idx is None:
            context = await fetch_live_context(address)
            if context is None:
                raise ValueError(f"No live context available for address: {address}")
            inference_graph = build_live_graph(context).to(self.device)
            node_idx = 0

        if inference_graph.x.size(0) <= node_idx:
            raise IndexError(f"Address {address!r} does not map to a valid node index {node_idx}.")

        with torch.no_grad():
            if hasattr(self.model, "predict_proba"):
                probs = self.model.predict_proba(
                    inference_graph.x,
                    inference_graph.edge_index,
                    inference_graph.edge_attr,
                )
            else:
                logits = self.model(
                    inference_graph.x,
                    inference_graph.edge_index,
                    inference_graph.edge_attr,
                )
                probs = torch.softmax(logits, dim=-1)

            if probs.dim() != 2 or probs.size(0) <= node_idx:
                raise ValueError("Model output is not a valid [num_nodes, 2] probability tensor.")

            p_fraud = float(probs[node_idx, 1].clamp(0.0, 1.0).item())

        trust_score = int((1 - p_fraud) * 1000)
        trust_level = self._get_trust_level(trust_score)
        risk_level = self._get_risk_level(trust_level)

        explanation = "Score derived from GNN graph topology and behavioral signals."
        explain_graph = inference_graph
        if HAS_EXPLAINER and self.explainer is not None:
            try:
                explain_kwargs = {
                    "x": explain_graph.x,
                    "edge_index": explain_graph.edge_index,
                }
                if hasattr(explain_graph, "edge_attr") and explain_graph.edge_attr is not None:
                    explain_kwargs["edge_attr"] = explain_graph.edge_attr

                exp = self.explainer.explain_node(node_idx, **explain_kwargs)
                if isinstance(exp, dict) and "summary" in exp:
                    explanation = exp["summary"].replace("\n", " ")
                else:
                    explanation = str(exp)
            except Exception as exc:
                logger.warning("Failed to generate explanation", error=str(exc))

        return {
            "address": address,
            "trust_score": trust_score,
            "risk_level": risk_level,
            "trust_level": trust_level,
            "confidence": float(max(p_fraud, 1.0 - p_fraud)),
            "fraud_probability": p_fraud,
            "network": "solana",
            "explanation": explanation,
        }

    async def score_batch(self, addresses: List[str]) -> List[dict]:
        """Batch scoring for multiple addresses."""
        if not addresses:
            return []
        return await asyncio.gather(*(self.score_address(addr) for addr in addresses))


# Module-level singleton
_scorer: Optional[FraudScorer] = None


def get_scorer() -> FraudScorer:
    """Get the singleton instance of FraudScorer."""
    global _scorer
    if _scorer is None:
        _scorer = FraudScorer()
    return _scorer
