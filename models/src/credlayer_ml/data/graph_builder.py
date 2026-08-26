"""Converts preprocessed DataFrames into a PyTorch Geometric Data object for the standalone ML service.
"""
from __future__ import annotations

import logging
from pathlib import Path

import numpy as np
import polars as pl
import torch
from torch_geometric.data import Data

from credlayer_ml.config import PipelineConfig, get_default_config
from credlayer_ml.data.preprocess import preprocess

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def build_graph(nodes_df: pl.DataFrame, edges_df: pl.DataFrame, config: PipelineConfig) -> Data:
    """Build a PyTorch Geometric Data object from preprocessed DataFrames."""
    logger.info("Building PyTorch Geometric Data object...")
    
    if nodes_df.height == 0:
        logger.warning("Empty nodes DataFrame. Returning empty Data object.")
        return Data()

    # Extract node features (x)
    exclude_cols = ["node_id", "address", "is_fraud", "source"]
    feature_cols = [col for col in nodes_df.columns if col not in exclude_cols]
    
    if feature_cols:
        x_np = nodes_df.select(feature_cols).to_numpy()
        x = torch.tensor(x_np, dtype=torch.float32)
    else:
        logger.warning("No feature columns found. Creating dummy feature tensor.")
        x = torch.ones((nodes_df.height, 1), dtype=torch.float32)
        
    config.model.in_features = x.shape[1]
    
    # Extract labels (y)
    y_np = nodes_df.select("is_fraud").to_numpy().squeeze()
    y = torch.tensor(y_np, dtype=torch.int64)
    
    # Extract edges (edge_index)
    if edges_df.height > 0:
        src = edges_df.select("src_id").to_numpy().squeeze()
        dst = edges_df.select("dst_id").to_numpy().squeeze()
        
        if src.ndim == 0:
            src = np.array([src])
            dst = np.array([dst])
            
        edge_index_np = np.stack([src, dst], axis=0)
        edge_index = torch.tensor(edge_index_np, dtype=torch.int64)
        
        edge_exclude = ["src_id", "dst_id"]
        edge_feat_cols = [col for col in edges_df.columns if col not in edge_exclude]
        
        if edge_feat_cols:
            edge_attr_np = edges_df.select(edge_feat_cols).to_numpy()
            edge_attr = torch.tensor(edge_attr_np, dtype=torch.float32)
        else:
            edge_attr = None
    else:
        edge_index = torch.empty((2, 0), dtype=torch.int64)
        edge_attr = torch.empty((0, 1), dtype=torch.float32)
        
    # Create temporal split based on random split
    num_nodes = nodes_df.height
    indices = np.random.permutation(num_nodes)
    
    train_size = int(0.6 * num_nodes)
    val_size = int(0.2 * num_nodes)
    
    train_idx = indices[:train_size]
    val_idx = indices[train_size:train_size + val_size]
    test_idx = indices[train_size + val_size:]
    
    train_mask = torch.zeros(num_nodes, dtype=torch.bool)
    val_mask = torch.zeros(num_nodes, dtype=torch.bool)
    test_mask = torch.zeros(num_nodes, dtype=torch.bool)
    
    train_mask[train_idx] = True
    val_mask[val_idx] = True
    test_mask[test_idx] = True
    
    # Attach address list for inference mapping
    address_list = nodes_df.select("address").to_series().to_list() if "address" in nodes_df.columns else []
    
    # Construct Data object
    data = Data(
        x=x,
        edge_index=edge_index,
        edge_attr=edge_attr,
        y=y,
        train_mask=train_mask,
        val_mask=val_mask,
        test_mask=test_mask,
        address=address_list
    )
    
    # Save graph
    out_path = config.paths.graph_path
    logger.info(f"Saving graph to {out_path}")
    torch.save(data, out_path)
    
    return data


def load_graph(config: PipelineConfig) -> Data:
    """Load graph from disk."""
    graph_path = config.paths.graph_path
    if not graph_path.exists():
        raise FileNotFoundError(f"Graph file not found at {graph_path}")
    
    logger.info(f"Loading graph from {graph_path}")
    data = torch.load(graph_path, weights_only=False)
    
    if hasattr(data, 'x') and data.x is not None:
        config.model.in_features = data.x.shape[1]
        
    return data


if __name__ == "__main__":
    cfg = get_default_config()
    cfg.paths.ensure_dirs()
    
    logger.info("Starting data pipeline...")
    nodes_df, edges_df = preprocess(cfg)
    graph_data = build_graph(nodes_df, edges_df, cfg)
    
    logger.info("Pipeline completed successfully.")
    logger.info(f"Graph created with {graph_data.num_nodes} nodes and {graph_data.num_edges} edges.")
    logger.info(f"Feature dimension: {graph_data.num_node_features}")
