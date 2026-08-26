# CredLayer ML — Standalone GNN Fraud Detection & Reputation Scoring Service

A standalone microservice that trains a Graph Neural Network (GraphSAGE + GATv2) on Solana DeFi data (SolRPDS, Kaggle Solana, Solarchive) and serves real-time wallet fraud probabilities, 0–1000 reputation trust scores, and Explainable AI (XAI) feature attributions.

---

## Architecture Overview

```
[ SolRPDS (GitHub) ]     [ Kaggle Solana ]     [ Solarchive (HF Parquet) ]
       │                         │                         │
       └─────────────────────────┼─────────────────────────┘
                                 │
                                 ▼
                     credlayer_ml.data.preprocess
               (Nodes: 22k+ Rugs / Legit Labels)
              (Edges: Txn Flow & Volume Aggregates)
                                 │
                                 ▼
                   credlayer_ml.data.graph_builder
               (PyTorch Geometric Data Object: fraud_graph.pt)
                                 │
                                 ▼
                    credlayer_ml.models.fraud_gnn
          (GraphSAGE Layer 1 → GATv2 Layer → GraphSAGE Layer 2)
                                 │
                                 ▼
                         credlayer_ml.train
                    (FocalLoss + Early Stopping)
                                 │
                                 ▼
                       credlayer_ml.inference
       (Calculates Fraud Prob & Maps to 0-1000 Trust Score)
                                 │
                                 ▼
                  credlayer_ml.main (FastAPI on Port 8001)
```

---

## 1. Quick Start & Server Execution

### Install Dependencies
Requires [uv](https://docs.astral.sh/uv/):
```bash
cd models
uv sync
```

### Run the Standalone ML Service (Port 8001)
```bash
uv run uvicorn credlayer_ml.main:app --port 8001 --reload
```

---

## 2. Complete Model Training & Evaluation Pipeline

Run these commands inside the `models/` directory:

### Step 1: Download Datasets
Downloads SolRPDS (GitHub CSVs), Kaggle Solana dataset, and Solarchive (HuggingFace Parquet daily slices):
```bash
uv run python -m credlayer_ml.data.download
```

### Step 2: Feature Engineering & Graph Construction
Processes raw data, joins multi-hop transaction flows, extracts behavioral features (SOL volume, in/out degrees, counterparty counts, average tx sizes), and compiles the PyTorch Geometric graph:
```bash
uv run python -m credlayer_ml.data.graph_builder
```
*Output: `models/data/processed/fraud_graph.pt`*

### Step 3: Train the GNN Model
Trains the GraphSAGE + GATv2 hybrid architecture with FocalLoss and validation early stopping:
```bash
uv run python -m credlayer_ml.train
```
*Output: `models/data/models/fraud_gnn_best.pt`*

### Step 4: Evaluate the Model
Runs test set evaluation, generates metrics (Accuracy, Precision, Recall, Macro F1, AUROC, PR-AUC), a classification report, and confusion matrix plot:
```bash
uv run python -m credlayer_ml.evaluate
```
*Outputs: `models/data/processed/eval_report.txt` and `models/data/processed/confusion_matrix.png`*

---

## 3. Testing the ML Service API

### Liveness & Readiness Probes
```bash
curl -s http://127.0.0.1:8001/healthz | python3 -m json.tool
curl -s http://127.0.0.1:8001/readyz | python3 -m json.tool
```

### Single Wallet Reputation Score (GET)
```bash
curl -s http://127.0.0.1:8001/api/v1/scores/FfetZ9oHhYmHQq7n7K37UQAMCu3pf4Bx5TKyKQpTSQYs | python3 -m json.tool
```

**Example Response:**
```json
{
    "success": true,
    "data": {
        "address": "FfetZ9oHhYmHQq7n7K37UQAMCu3pf4Bx5TKyKQpTSQYs",
        "trustScore": 468,
        "trustLevel": "low",
        "riskLevel": "medium",
        "confidence": 0.9,
        "fraudProbability": 0.5311985015869141,
        "network": "solana",
        "explanation": "The prediction for node 44059 was most influenced by: Features [feature_0 (0.0000), feature_1 (0.0000), feature_2 (0.0000), feature_3 (0.0000), feature_4 (0.0000)], Neighbor Connections [None]"
    },
    "message": null,
    "timestamp": "2026-08-26T10:53:27.761457Z"
}
```

### Batch Wallet Reputation Scoring (POST)
```bash
curl -s -X POST http://127.0.0.1:8001/api/v1/scores/batch \
  -H "Content-Type: application/json" \
  -d '{
    "addresses": [
      "FfetZ9oHhYmHQq7n7K37UQAMCu3pf4Bx5TKyKQpTSQYs",
      "G61NTJEvxUuTPsNuW9AKKDX2yQWnVgaZWs4YQ9xMcpPx",
      "DKXrKtQFUNAr5Rcq19CMFzYgqynJ3uJ78bux4fsPty5P"
    ]
  }' | python3 -m json.tool
```

---

## 4. Interactive Swagger UI

Open your browser to:
[http://localhost:8001/docs](http://localhost:8001/docs)

---

## 5. Unit Tests

```bash
uv run python -m unittest discover -s tests -p "test_*.py"
```
