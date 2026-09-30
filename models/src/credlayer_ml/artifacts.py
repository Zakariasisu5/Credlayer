"""Download the versioned inference artifacts required by the ML service."""

from __future__ import annotations

import shutil
import time
from pathlib import Path

import structlog
from huggingface_hub import hf_hub_download

from credlayer_ml.config import PipelineConfig, get_default_config

logger = structlog.get_logger(__name__)

MODEL_REPO_ID = "ritesh-das/credlayer-solana-fraud-gnn"
ARTIFACT_FILENAMES = ("fraud_graph.pt", "fraud_gnn_best.pt")


def _download_artifact(filename: str, destination: Path, retries: int = 3) -> None:
    """Download one artifact into its configured destination, retrying transient failures."""
    if destination.is_file():
        logger.info("Inference artifact already present", artifact=filename, path=str(destination))
        return

    last_error: Exception | None = None
    for attempt in range(1, retries + 1):
        try:
            logger.info(
                "Downloading inference artifact",
                artifact=filename,
                repo_id=MODEL_REPO_ID,
                attempt=attempt,
                attempts=retries,
            )
            cached_path = hf_hub_download(repo_id=MODEL_REPO_ID, filename=filename)
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(cached_path, destination)
            logger.info(
                "Inference artifact downloaded successfully",
                artifact=filename,
                path=str(destination),
            )
            return
        except Exception as exc:
            last_error = exc
            logger.error(
                "Inference artifact download failed",
                artifact=filename,
                attempt=attempt,
                attempts=retries,
                error=str(exc),
            )
            if attempt < retries:
                time.sleep(min(2**attempt, 8))

    raise RuntimeError(
        f"Unable to download required inference artifact {filename!r} from "
        f"{MODEL_REPO_ID} after {retries} attempts"
    ) from last_error


def ensure_inference_artifacts(config: PipelineConfig | None = None) -> None:
    """Ensure both inference artifacts exist before the service accepts traffic."""
    config = config or get_default_config()
    config.paths.ensure_dirs()
    _download_artifact("fraud_graph.pt", config.paths.graph_path)
    _download_artifact("fraud_gnn_best.pt", config.paths.best_model_path)
    logger.info(
        "All inference artifacts are ready",
        graph_path=str(config.paths.graph_path),
        model_path=str(config.paths.best_model_path),
    )


__all__ = ["ARTIFACT_FILENAMES", "MODEL_REPO_ID", "ensure_inference_artifacts"]


if __name__ == "__main__":
    ensure_inference_artifacts()
    print("Inference artifacts ready")
