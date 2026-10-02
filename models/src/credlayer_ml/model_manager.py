"""Model artifact management with automatic Hugging Face downloads.
"""
from __future__ import annotations

import shutil
from pathlib import Path

import structlog
from huggingface_hub import hf_hub_download

from credlayer_ml.config import PathConfig

logger = structlog.get_logger(__name__)

# Hugging Face repository containing the trained model artifacts
HF_REPO_ID = "ritesh-das/credlayer-solana-fraud-gnn"
HF_MODEL_FILE = "fraud_gnn_best.pt"
HF_GRAPH_FILE = "fraud_graph.pt"


def download_model_artifacts(paths: PathConfig, force: bool = False) -> tuple[bool, bool]:
    """Download model artifacts from Hugging Face if not present locally.
    
    Args:
        paths: PathConfig containing target paths for model files
        force: If True, re-download even if files exist locally
        
    Returns:
        Tuple of (model_success, graph_success) booleans
        
    Raises:
        RuntimeError: If downloads fail and files are not available
    """
    paths.ensure_dirs()
    
    model_exists = paths.best_model_path.exists()
    graph_exists = paths.graph_path.exists()
    
    if model_exists and graph_exists and not force:
        logger.info(
            "Model artifacts already exist locally, skipping download",
            model_path=str(paths.best_model_path),
            graph_path=str(paths.graph_path),
        )
        return True, True
    
    model_success = False
    graph_success = False
    
    # Download fraud_gnn_best.pt
    if not model_exists or force:
        try:
            logger.info(
                "Downloading trained model from Hugging Face",
                repo=HF_REPO_ID,
                file=HF_MODEL_FILE,
                target=str(paths.best_model_path),
            )
            cached_path = hf_hub_download(
                repo_id=HF_REPO_ID,
                filename=HF_MODEL_FILE,
                repo_type="model",
            )
            shutil.copy(cached_path, paths.best_model_path)
            logger.info("Model checkpoint downloaded successfully", path=str(paths.best_model_path))
            model_success = True
        except Exception as exc:
            logger.error(
                "Failed to download model checkpoint from Hugging Face",
                repo=HF_REPO_ID,
                file=HF_MODEL_FILE,
                error=str(exc),
            )
            if not paths.best_model_path.exists():
                raise RuntimeError(
                    f"Model checkpoint unavailable: download failed and no local copy exists at {paths.best_model_path}"
                ) from exc
    else:
        model_success = True
        
    # Download fraud_graph.pt
    if not graph_exists or force:
        try:
            logger.info(
                "Downloading processed graph from Hugging Face",
                repo=HF_REPO_ID,
                file=HF_GRAPH_FILE,
                target=str(paths.graph_path),
            )
            cached_path = hf_hub_download(
                repo_id=HF_REPO_ID,
                filename=HF_GRAPH_FILE,
                repo_type="model",
            )
            shutil.copy(cached_path, paths.graph_path)
            logger.info("Graph artifact downloaded successfully", path=str(paths.graph_path))
            graph_success = True
        except Exception as exc:
            logger.error(
                "Failed to download graph artifact from Hugging Face",
                repo=HF_REPO_ID,
                file=HF_GRAPH_FILE,
                error=str(exc),
            )
            if not paths.graph_path.exists():
                raise RuntimeError(
                    f"Graph artifact unavailable: download failed and no local copy exists at {paths.graph_path}"
                ) from exc
    else:
        graph_success = True
        
    return model_success, graph_success


def verify_artifacts(paths: PathConfig) -> tuple[bool, bool]:
    """Verify that required artifacts exist on disk.
    
    Returns:
        Tuple of (model_exists, graph_exists) booleans
    """
    model_exists = paths.best_model_path.exists()
    graph_exists = paths.graph_path.exists()
    
    if not model_exists:
        logger.warning("Model checkpoint not found", path=str(paths.best_model_path))
    if not graph_exists:
        logger.warning("Graph artifact not found", path=str(paths.graph_path))
        
    return model_exists, graph_exists
