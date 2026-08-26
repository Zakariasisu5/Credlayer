"""Dataset acquisition script that downloads all three datasets for the GNN fraud detection data pipeline.
"""
from __future__ import annotations

import logging
from pathlib import Path

import requests

from credlayer_ml.config import PipelineConfig, get_default_config

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def download_solrpds(solrpds_dir: Path) -> None:
    """Download SolRPDS CSV files from GitHub."""
    logger.info("Downloading SolRPDS data...")
    base_url = "https://raw.githubusercontent.com/DeFiLabX/SolRPDS/main/dataset/CSV"
    files = ["2021.csv", "2022.csv", "2023.csv", "Jan_2024-Nov_2024.csv"]

    for file_name in files:
        url = f"{base_url}/{file_name}"
        out_path = solrpds_dir / file_name
        if out_path.exists():
            logger.info(f"File {file_name} already exists, skipping download.")
            continue
        
        logger.info(f"Downloading {file_name} from {url}...")
        response = requests.get(url, timeout=30)
        if response.status_code == 200:
            out_path.write_bytes(response.content)
            logger.info(f"Successfully downloaded {file_name}.")
        else:
            logger.error(f"Failed to download {file_name}: HTTP {response.status_code}")


def download_kaggle_solana(kaggle_dir: Path) -> None:
    """Download Kaggle Solana dataset. Provides fallback if kagglehub auth fails."""
    logger.info("Downloading Kaggle Solana dataset...")
    
    # Check if a CSV already exists in the directory
    csv_files = list(kaggle_dir.glob("*.csv"))
    if csv_files:
        logger.info(f"Kaggle data already seems to exist at {csv_files[0]}")
        return

    try:
        import kagglehub
        path = kagglehub.dataset_download("thedevastator/solana-blockchain-dataset")
        
        # Copy files to our standard directory
        import shutil
        for file in Path(path).glob("*.csv"):
            shutil.copy(file, kaggle_dir / file.name)
        logger.info(f"Successfully downloaded Kaggle dataset to {kaggle_dir}")
        
    except Exception as e:
        logger.warning(f"Could not download Kaggle dataset automatically: {e}")
        logger.info("MANUAL ACTION REQUIRED:")
        logger.info("Please download the dataset from: https://www.kaggle.com/datasets/thedevastator/solana-blockchain-dataset")
        logger.info(f"And place the CSV file(s) in: {kaggle_dir}")


def download_solarchive(solarchive_dir: Path) -> None:
    """Download Solarchive Parquet transaction files for Q3 2023."""
    logger.info("Downloading Solarchive data (Q3 2023)...")
    
    try:
        from huggingface_hub import snapshot_download
        allow_patterns = [
            "data/2023-07-*.parquet",
            "data/2023-08-*.parquet",
            "data/2023-09-*.parquet",
        ]
        
        snapshot_download(
            repo_id="solarchive/solarchive",
            repo_type="dataset",
            local_dir=str(solarchive_dir),
            allow_patterns=allow_patterns,
        )
        logger.info(f"Successfully downloaded Solarchive data to {solarchive_dir}")
        
    except Exception as e:
        logger.error(f"Failed to download Solarchive data: {e}")


def download_all(config: PipelineConfig) -> None:
    """Create directories and download all datasets."""
    config.paths.ensure_dirs()
    
    download_solrpds(config.paths.solrpds_dir)
    download_kaggle_solana(config.paths.kaggle_dir)
    download_solarchive(config.paths.solarchive_dir)
    
    logger.info("All downloads completed.")


if __name__ == "__main__":
    cfg = get_default_config()
    download_all(cfg)
