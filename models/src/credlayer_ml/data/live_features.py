import polars as pl
import torch
from torch_geometric.data import Data
import logging

logger = logging.getLogger(__name__)

def build_live_graph(context_data: dict) -> Data:
    """
    Transforms raw RPC context into a 1-hop ego-graph for PyTorch Geometric.
    Target wallet is strictly guaranteed to be node index 0.
    """
    target_address = context_data["target_address"]
    edges_list = context_data["edges"]
    
    # Handle the edge case of a brand new wallet with zero transactions
    if not edges_list:
        logger.warning(f"No edges found for {target_address}. Creating isolated node.")
        x = torch.zeros((1, 5), dtype=torch.float)
        edge_index = torch.empty((2, 0), dtype=torch.long)
        return Data(x=x, edge_index=edge_index)

    df_edges = pl.DataFrame(edges_list)
    
    # 1. Create Node ID Mapping (Target Address is ALWAYS index 0)
    unique_nodes = list(set([target_address] + context_data["counterparties"]))
    unique_nodes.remove(target_address)
    unique_nodes = [target_address] + unique_nodes 
    
    node_mapping = {addr: i for i, addr in enumerate(unique_nodes)}
    
    # 2. Compute Outgoing Features (Sender Stats)
    sender_stats = (
        df_edges.group_by("source")
        .agg([
            pl.len().alias("out_degree"),
            pl.col("volume").sum().alias("total_sent")
        ])
        .rename({"source": "node"})
    )
    
    # 3. Compute Incoming Features (Receiver Stats)
    receiver_stats = (
        df_edges.group_by("target")
        .agg([
            pl.len().alias("in_degree"),
            pl.col("volume").sum().alias("total_received")
        ])
        .rename({"target": "node"})
    )
    
    # 4. Merge Features and Calculate Averages
    df_nodes = pl.DataFrame({"node": unique_nodes})
    
    df_features = (
        df_nodes
        .join(sender_stats, on="node", how="left")
        .join(receiver_stats, on="node", how="left")
        .fill_null(0)
        .with_columns([
            # Avoid division by zero by clamping the denominator to a minimum of 1
            ((pl.col("total_sent") + pl.col("total_received")) / 
             pl.max_horizontal(pl.col("out_degree") + pl.col("in_degree"), 1)).alias("avg_tx_size")
        ])
    )
    
    # 5. Extract Tensors for PyTorch Geometric
    feature_cols = ["in_degree", "out_degree", "total_received", "total_sent", "avg_tx_size"]
    x_tensor = torch.tensor(df_features.select(feature_cols).to_numpy(), dtype=torch.float)
    
    source_indices = [node_mapping[src] for src in df_edges["source"].to_list()]
    target_indices = [node_mapping[tgt] for tgt in df_edges["target"].to_list()]
    
    edge_index = torch.tensor([source_indices, target_indices], dtype=torch.long)
    
    # Optional: Edge weights based on transaction volume
    edge_weight = torch.tensor(df_edges["volume"].to_list(), dtype=torch.float)
    
    logger.info(f"Built PyG Data object: {len(unique_nodes)} nodes, {len(edges_list)} edges")
    return Data(x=x_tensor, edge_index=edge_index, edge_attr=edge_weight)