"""Hyperparameter configuration and path settings for the Standalone GNN ML service.

All tuneable values live here so that data ingestion, training, evaluation,
and inference share a single source of truth. Paths default to ``models/data/``
relative to the models root directory.
"""

from __future__ import annotations

from pathlib import Path
from typing import Literal

from pydantic import BaseModel, Field

try:
    from pydantic_settings import BaseSettings, SettingsConfigDict
except ImportError:
    class BaseSettings(BaseModel):
        pass
    def SettingsConfigDict(**kwargs):
        return kwargs

# ---------------------------------------------------------------------------
# Resolve models directory root: models/src/credlayer_ml/config.py → models/
# ---------------------------------------------------------------------------
_THIS_DIR = Path(__file__).resolve().parent              # …/src/credlayer_ml/
_MODELS_ROOT = _THIS_DIR.parent.parent                   # …/models/

# ---------------------------------------------------------------------------
# Path configuration
# ---------------------------------------------------------------------------

class PathConfig(BaseModel):
    """Filesystem paths for raw data, processed artefacts, and model checkpoints."""

    data_root: Path = Field(default_factory=lambda: _MODELS_ROOT / "data")
    raw_dir: Path = Field(default_factory=lambda: _MODELS_ROOT / "data" / "raw")
    solrpds_dir: Path = Field(default_factory=lambda: _MODELS_ROOT / "data" / "raw" / "solrpds")
    kaggle_dir: Path = Field(default_factory=lambda: _MODELS_ROOT / "data" / "raw" / "kaggle_solana")
    solarchive_dir: Path = Field(default_factory=lambda: _MODELS_ROOT / "data" / "raw" / "solarchive")
    processed_dir: Path = Field(default_factory=lambda: _MODELS_ROOT / "data" / "processed")
    models_dir: Path = Field(default_factory=lambda: _MODELS_ROOT / "data" / "models")

    # Final artefact file names
    graph_file: str = "fraud_graph.pt"
    best_model_file: str = "fraud_gnn_best.pt"

    def ensure_dirs(self) -> None:
        """Create every configured directory if it doesn't exist."""
        for d in (
            self.data_root,
            self.raw_dir,
            self.solrpds_dir,
            self.kaggle_dir,
            self.solarchive_dir,
            self.processed_dir,
            self.models_dir,
        ):
            d.mkdir(parents=True, exist_ok=True)

    @property
    def graph_path(self) -> Path:
        return self.processed_dir / self.graph_file

    @property
    def best_model_path(self) -> Path:
        return self.models_dir / self.best_model_file


# ---------------------------------------------------------------------------
# Model architecture
# ---------------------------------------------------------------------------

class ModelConfig(BaseModel):
    """Architecture hyper-parameters for the GraphSAGE + GATv2 model."""

    in_features: int = 16          # set dynamically from graph.num_node_features
    hidden_dim: int = 128
    out_dim: int = 2               # binary: legitimate / fraudulent
    sage_layers: int = 2
    gat_heads: int = 4
    dropout: float = 0.3
    aggr: Literal["mean", "max", "add"] = "mean"
    edge_dim: int | None = None


# ---------------------------------------------------------------------------
# Training
# ---------------------------------------------------------------------------

class TrainingConfig(BaseModel):
    """Training hyper-parameters."""

    learning_rate: float = 1e-3
    weight_decay: float = 5e-4
    batch_size: int = 1024
    num_epochs: int = 200
    patience: int = 20              # early-stopping patience (epochs)
    num_neighbors: list[int] = Field(default_factory=lambda: [15, 10])
    focal_loss_gamma: float = 2.0   # 0 → standard CE
    device: str = "cpu"
    seed: int = 42


# ---------------------------------------------------------------------------
# Inference & Server Settings
# ---------------------------------------------------------------------------

class InferenceConfig(BaseModel):
    """Settings for inference scoring."""

    device: str = "cpu"
    score_scale: int = 1000         # maps P(fraud) to 0–1000 trust score


class ServerSettings(BaseSettings):
    """Server runtime configuration loaded from environment or .env."""
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    environment: str = "development"
    log_level: str = "INFO"
    host: str = "0.0.0.0"
    port: int = 8001
    cors_origins: list[str] = Field(default_factory=lambda: ["http://localhost:5173", "http://localhost:8000"])


# ---------------------------------------------------------------------------
# Aggregate config
# ---------------------------------------------------------------------------

class PipelineConfig(BaseModel):
    """Top-level configuration container."""

    paths: PathConfig = Field(default_factory=PathConfig)
    model: ModelConfig = Field(default_factory=ModelConfig)
    training: TrainingConfig = Field(default_factory=TrainingConfig)
    inference: InferenceConfig = Field(default_factory=InferenceConfig)


def get_default_config() -> PipelineConfig:
    """Return a ``PipelineConfig`` with sensible defaults."""
    return PipelineConfig()
