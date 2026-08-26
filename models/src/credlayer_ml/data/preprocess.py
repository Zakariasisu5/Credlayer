"""Feature engineering pipeline for building graph nodes and edges in the standalone ML service.
"""
from __future__ import annotations

import logging
from pathlib import Path
from typing import Tuple

import numpy as np
import polars as pl
from sklearn.preprocessing import StandardScaler

from credlayer_ml.config import PipelineConfig, get_default_config

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def _load_solrpds_nodes(solrpds_dir: Path) -> pl.DataFrame:
    """Load and process SolRPDS nodes."""
    files = list(solrpds_dir.glob("*.csv"))
    if not files:
        logger.warning(f"No SolRPDS CSV files found in {solrpds_dir}")
        return pl.DataFrame({"address": [], "is_fraud": [], "source": []}, schema={"address": pl.Utf8, "is_fraud": pl.Int64, "source": pl.Utf8})
    
    dfs = []
    for file in files:
        try:
            df = pl.read_csv(file, infer_schema_length=0)
            dfs.append(df)
        except Exception as e:
            logger.error(f"Failed to read {file}: {e}")
            
    if not dfs:
        return pl.DataFrame({"address": [], "is_fraud": [], "source": []}, schema={"address": pl.Utf8, "is_fraud": pl.Int64, "source": pl.Utf8})
        
    df = pl.concat(dfs, how="diagonal_relaxed")
    
    addr_cols = [col for col in df.columns if 'address' in col.lower() or 'mint' in col.lower()]
    
    if not addr_cols:
        logger.warning("No address column found in SolRPDS data.")
        return pl.DataFrame({"address": [], "is_fraud": [], "source": []}, schema={"address": pl.Utf8, "is_fraud": pl.Int64, "source": pl.Utf8})
    
    addr_dfs = []
    for col in addr_cols:
        sub_df = df.select([
            pl.col(col).alias("address")
        ]).drop_nulls()
        addr_dfs.append(sub_df)
        
    res_df = pl.concat(addr_dfs).unique(subset=["address"])
    
    res_df = res_df.with_columns(
        pl.lit(1).alias("is_fraud"),
        pl.lit("solrpds").alias("source")
    )
    
    return res_df


def _load_kaggle_nodes(kaggle_dir: Path) -> pl.DataFrame:
    """Load and process Kaggle Solana dataset nodes."""
    files = list(kaggle_dir.glob("*.csv"))
    if not files:
        logger.warning(f"No Kaggle CSV files found in {kaggle_dir}")
        return pl.DataFrame({"address": [], "is_fraud": [], "entity_type": [], "source": []}, 
                            schema={"address": pl.Utf8, "is_fraud": pl.Int64, "entity_type": pl.Utf8, "source": pl.Utf8})
        
    df = pl.read_csv(files[0], infer_schema_length=0)
    
    if "ADDRESS" not in df.columns:
        logger.warning("ADDRESS column not found in Kaggle data.")
        return pl.DataFrame({"address": [], "is_fraud": [], "entity_type": [], "source": []}, 
                            schema={"address": pl.Utf8, "is_fraud": pl.Int64, "entity_type": pl.Utf8, "source": pl.Utf8})
        
    res_df = df.select([
        pl.col("ADDRESS").alias("address"),
        pl.col("LABEL_TYPE").alias("entity_type")
    ]).drop_nulls(subset=["address"]).unique(subset=["address"])
    
    res_df = res_df.with_columns(
        pl.lit(0).alias("is_fraud"),
        pl.lit("kaggle").alias("source")
    )
    
    return res_df


def _load_solarchive_edges(solarchive_dir: Path) -> pl.DataFrame:
    """Load Solarchive Parquet transaction files to build edges."""
    files = list(solarchive_dir.glob("**/*.parquet"))
    if not files:
        logger.warning(f"No Solarchive Parquet files found in {solarchive_dir}")
        return pl.DataFrame({"sender": [], "receiver": [], "amount": [], "timestamp": [], "success": []},
                            schema={"sender": pl.Utf8, "receiver": pl.Utf8, "amount": pl.Float32, "timestamp": pl.Float32, "success": pl.Float32})
        
    try:
        lf = pl.scan_parquet(files)
        cols = lf.collect_schema().names()
        
        sender_col = "sender" if "sender" in cols else "signer" if "signer" in cols else "from_address" if "from_address" in cols else None
        receiver_col = "receiver" if "receiver" in cols else "to_address" if "to_address" in cols else None
        amount_col = "amount" if "amount" in cols else "value" if "value" in cols else None
        time_col = "block_time" if "block_time" in cols else "timestamp" if "timestamp" in cols else None
        success_col = "success" if "success" in cols else "status" if "status" in cols else None
        
        if not sender_col or not receiver_col:
            logger.warning("Could not identify sender/receiver columns in Solarchive data.")
            return pl.DataFrame({"sender": [], "receiver": [], "amount": [], "timestamp": [], "success": []},
                                schema={"sender": pl.Utf8, "receiver": pl.Utf8, "amount": pl.Float32, "timestamp": pl.Float32, "success": pl.Float32})
            
        select_exprs = [
            pl.col(sender_col).alias("sender"),
            pl.col(receiver_col).alias("receiver")
        ]
        
        if amount_col:
            select_exprs.append(pl.col(amount_col).cast(pl.Float32).alias("amount"))
        else:
            select_exprs.append(pl.lit(0.0).cast(pl.Float32).alias("amount"))
            
        if time_col:
            select_exprs.append(pl.col(time_col).cast(pl.Float32).alias("timestamp"))
        else:
            select_exprs.append(pl.lit(0.0).cast(pl.Float32).alias("timestamp"))
            
        if success_col:
            select_exprs.append(pl.col(success_col).cast(pl.Float32).alias("success"))
        else:
            select_exprs.append(pl.lit(1.0).cast(pl.Float32).alias("success"))
            
        df = lf.select(select_exprs).drop_nulls(subset=["sender", "receiver"]).collect()
        return df
        
    except Exception as e:
        logger.error(f"Failed to process Solarchive data: {e}")
        return pl.DataFrame({"sender": [], "receiver": [], "amount": [], "timestamp": [], "success": []},
                            schema={"sender": pl.Utf8, "receiver": pl.Utf8, "amount": pl.Float32, "timestamp": pl.Float32, "success": pl.Float32})


def preprocess(config: PipelineConfig) -> Tuple[pl.DataFrame, pl.DataFrame]:
    """Feature engineering pipeline. Returns (nodes_df, edges_df)."""
    
    # Step 1: Build Node Set
    logger.info("Building node set...")
    solrpds_nodes = _load_solrpds_nodes(config.paths.solrpds_dir)
    kaggle_nodes = _load_kaggle_nodes(config.paths.kaggle_dir)
    
    all_nodes = pl.concat([
        solrpds_nodes.select(["address", "is_fraud", "source"]),
        kaggle_nodes.select(["address", "is_fraud", "source"])
    ], how="diagonal_relaxed").unique(subset=["address"], keep="first")
    
    if "entity_type" in kaggle_nodes.columns:
        all_nodes = all_nodes.join(
            kaggle_nodes.select(["address", "entity_type"]), 
            on="address", 
            how="left"
        )
    else:
        all_nodes = all_nodes.with_columns(pl.lit(None).cast(pl.Utf8).alias("entity_type"))
        
    all_nodes = all_nodes.with_row_index("node_id")
    
    # Step 2: Engineer Node Features
    logger.info("Engineering node features...")
    if not all_nodes.select(pl.col("entity_type").is_null().all()).item():
        dummies = all_nodes.select(["node_id", "entity_type"]).to_dummies("entity_type")
        all_nodes = all_nodes.join(dummies, on="node_id", how="left")
    
    all_nodes = all_nodes.drop("entity_type")
    all_nodes = all_nodes.fill_null(0.0)
    
    # Step 3: Build Edge Set
    logger.info("Building edge set...")
    raw_edges = _load_solarchive_edges(config.paths.solarchive_dir)
    
    if raw_edges.height > 0:
        valid_addresses = all_nodes.select("address")
        
        edges_df = raw_edges.join(
            valid_addresses, left_on="sender", right_on="address", how="inner"
        ).vstack(
            raw_edges.join(
                valid_addresses, left_on="receiver", right_on="address", how="inner"
            )
        ).unique()
        
        edges_df = edges_df.join(
            all_nodes.select(["address", "node_id"]).rename({"node_id": "src_id"}),
            left_on="sender", right_on="address", how="inner"
        )
        edges_df = edges_df.join(
            all_nodes.select(["address", "node_id"]).rename({"node_id": "dst_id"}),
            left_on="receiver", right_on="address", how="inner"
        )
        edges_df = edges_df.drop(["sender", "receiver"])
        
        out_agg = edges_df.group_by("src_id").agg([
            pl.len().alias("out_degree"),
            pl.col("amount").sum().alias("out_volume"),
            pl.col("dst_id").n_unique().alias("out_unique_counterparties")
        ])
        
        in_agg = edges_df.group_by("dst_id").agg([
            pl.len().alias("in_degree"),
            pl.col("amount").sum().alias("in_volume"),
            pl.col("src_id").n_unique().alias("in_unique_counterparties")
        ])
        
        all_nodes = all_nodes.join(out_agg, left_on="node_id", right_on="src_id", how="left")
        all_nodes = all_nodes.join(in_agg, left_on="node_id", right_on="dst_id", how="left")
        
        all_nodes = all_nodes.fill_null(0.0).with_columns([
            (pl.col("out_volume") + pl.col("in_volume")).alias("total_sol_volume"),
            (pl.col("out_degree") + pl.col("in_degree")).alias("transaction_count"),
            (pl.col("out_unique_counterparties") + pl.col("in_unique_counterparties")).alias("unique_counterparty_count")
        ])
        
        all_nodes = all_nodes.with_columns(
            pl.when(pl.col("transaction_count") > 0)
            .then(pl.col("total_sol_volume") / pl.col("transaction_count"))
            .otherwise(0.0)
            .alias("avg_transaction_size")
        )
    else:
        logger.info("Solarchive data not found. Creating synthetic edges (fallback mode)...")
        if all_nodes.height > 1:
            np.random.seed(42)
            n_edges = min(1000, all_nodes.height * 2)
            src_ids = np.random.randint(0, all_nodes.height, n_edges)
            dst_ids = np.random.randint(0, all_nodes.height, n_edges)
            
            edges_df = pl.DataFrame({
                "src_id": src_ids,
                "dst_id": dst_ids,
                "amount": np.random.uniform(0.1, 100.0, n_edges).astype(np.float32),
                "timestamp": np.random.uniform(1.6e9, 1.7e9, n_edges).astype(np.float32),
                "success": np.ones(n_edges, dtype=np.float32)
            })
            edges_df = edges_df.filter(pl.col("src_id") != pl.col("dst_id"))
            
            all_nodes = all_nodes.with_columns([
                pl.lit(0.0).cast(pl.Float64).alias("in_degree"),
                pl.lit(0.0).cast(pl.Float64).alias("out_degree"),
                pl.lit(0.0).cast(pl.Float64).alias("total_sol_volume"),
                pl.lit(0.0).cast(pl.Float64).alias("unique_counterparty_count"),
                pl.lit(0.0).cast(pl.Float64).alias("transaction_count"),
                pl.lit(0.0).cast(pl.Float64).alias("avg_transaction_size")
            ])
        else:
            edges_df = pl.DataFrame(schema={"src_id": pl.UInt32, "dst_id": pl.UInt32, "amount": pl.Float32, "timestamp": pl.Float32, "success": pl.Float32})
    
    numeric_cols = [col for col in all_nodes.columns if col not in ["node_id", "address", "is_fraud", "source"] and all_nodes[col].dtype in [pl.Float32, pl.Float64, pl.Int32, pl.Int64, pl.UInt32, pl.UInt64]]
    
    if numeric_cols and all_nodes.height > 0:
        scaler = StandardScaler()
        data = all_nodes.select(numeric_cols).to_numpy()
        scaled_data = scaler.fit_transform(data)
        
        for i, col in enumerate(numeric_cols):
            all_nodes = all_nodes.with_columns(
                pl.Series(name=col, values=scaled_data[:, i]).cast(pl.Float32)
            )
            
    for col in numeric_cols:
        if all_nodes[col].dtype != pl.Float32:
            all_nodes = all_nodes.with_columns(pl.col(col).cast(pl.Float32))

    return all_nodes, edges_df


if __name__ == "__main__":
    cfg = get_default_config()
    cfg.paths.ensure_dirs()
    nodes, edges = preprocess(cfg)
    logger.info(f"Generated {nodes.height} nodes and {edges.height} edges.")
