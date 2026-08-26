"""Evaluation script for the FraudGNN model in standalone ML service.
"""
import matplotlib.pyplot as plt
import numpy as np
import structlog
import torch
from sklearn.metrics import (
    accuracy_score,
    average_precision_score,
    classification_report,
    confusion_matrix,
    precision_recall_fscore_support,
    roc_auc_score,
)

from credlayer_ml.config import PipelineConfig, get_default_config
from credlayer_ml.data.graph_builder import load_graph
from credlayer_ml.models.fraud_gnn import FraudGNN

logger = structlog.get_logger(__name__)


def evaluate_model(config: PipelineConfig) -> dict:
    """Evaluate the best model checkpoint on the test set."""
    device = torch.device('cpu')
    
    logger.info("Loading graph...")
    graph = load_graph(config).to(device)
    config.model.in_features = graph.num_node_features
    
    logger.info("Loading model...")
    model = FraudGNN(config.model).to(device)
    if config.paths.best_model_path.exists():
        model.load_state_dict(torch.load(config.paths.best_model_path, map_location=device, weights_only=True))
    else:
        logger.warning("No model checkpoint found! Evaluating uninitialized model.")
        
    model.eval()
    
    logger.info("Running inference on test set...")
    with torch.no_grad():
        logits = model(graph.x, graph.edge_index, graph.edge_attr)
        test_logits = logits[graph.test_mask]
        test_y = graph.y[graph.test_mask]
        
    test_preds = test_logits.argmax(dim=-1).cpu().numpy()
    test_probs = torch.softmax(test_logits, dim=-1)[:, 1].cpu().numpy()
    test_y = test_y.cpu().numpy()
    
    acc = accuracy_score(test_y, test_preds)
    precision, recall, f1, _ = precision_recall_fscore_support(test_y, test_preds, labels=[0, 1], average=None, zero_division=0)
    macro_precision, macro_recall, macro_f1, _ = precision_recall_fscore_support(test_y, test_preds, average='macro', zero_division=0)
    
    if len(np.unique(test_y)) >= 2:
        try:
            auroc = float(roc_auc_score(test_y, test_probs))
        except Exception:
            auroc = 0.5
            
        try:
            pr_auc = float(average_precision_score(test_y, test_probs))
        except Exception:
            pr_auc = 0.0
    else:
        auroc = 1.0 if acc == 1.0 else 0.5
        pr_auc = 1.0 if acc == 1.0 else 0.0
        
    metrics = {
        "accuracy": float(acc),
        "precision_class_0": float(precision[0]),
        "precision_class_1": float(precision[1]),
        "recall_class_0": float(recall[0]),
        "recall_class_1": float(recall[1]),
        "f1_class_0": float(f1[0]),
        "f1_class_1": float(f1[1]),
        "macro_precision": float(macro_precision),
        "macro_recall": float(macro_recall),
        "macro_f1": float(macro_f1),
        "auroc": auroc,
        "pr_auc": pr_auc
    }
    
    cm = confusion_matrix(test_y, test_preds, labels=[0, 1])
    
    report = classification_report(test_y, test_preds, zero_division=0)
    config.paths.processed_dir.mkdir(parents=True, exist_ok=True)
    report_path = config.paths.processed_dir / 'eval_report.txt'
    with open(report_path, 'w') as f:
        f.write(report)
    logger.info(f"Classification report saved to {report_path}")
        
    fig, ax = plt.subplots()
    cax = ax.matshow(cm, cmap=plt.cm.Blues)
    fig.colorbar(cax)
    plt.title('Confusion Matrix')
    plt.xlabel('Predicted Label')
    plt.ylabel('True Label')
    
    for i in range(cm.shape[0]):
        for j in range(cm.shape[1]):
            ax.text(j, i, str(cm[i, j]), va='center', ha='center')
            
    plot_path = config.paths.processed_dir / 'confusion_matrix.png'
    plt.savefig(plot_path)
    plt.close()
    logger.info(f"Confusion matrix plot saved to {plot_path}")
    
    return metrics


if __name__ == '__main__':
    config = get_default_config()
    metrics = evaluate_model(config)
    logger.info("Evaluation complete", metrics=metrics)
