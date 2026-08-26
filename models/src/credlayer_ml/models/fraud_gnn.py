"""GraphSAGE and GATv2 hybrid model for fraud detection."""

import torch
import torch.nn as nn
import torch.nn.functional as F
from torch_geometric.nn import SAGEConv, GATv2Conv, BatchNorm

from credlayer_ml.config import ModelConfig


class FraudGNN(nn.Module):
    """Hybrid GraphSAGE + GATv2 model for node classification."""

    def __init__(self, config: ModelConfig) -> None:
        """Initialize the FraudGNN model.
        
        Args:
            config: Model configuration containing hyperparameters.
        """
        super().__init__()
        
        # Layer 1: SAGEConv
        self.conv1 = SAGEConv(
            config.in_features, 
            config.hidden_dim, 
            aggr=config.aggr
        )
        self.bn1 = BatchNorm(config.hidden_dim)
        
        # Layer 2: GATv2Conv
        self.edge_dim = getattr(config, 'edge_dim', None)
        if self.edge_dim is not None:
            self.conv2 = GATv2Conv(
                config.hidden_dim, 
                config.hidden_dim, 
                heads=config.gat_heads, 
                concat=False,
                edge_dim=self.edge_dim
            )
        else:
            self.conv2 = GATv2Conv(
                config.hidden_dim, 
                config.hidden_dim, 
                heads=config.gat_heads, 
                concat=False
            )
        self.bn2 = BatchNorm(config.hidden_dim)
        
        # Layer 3: SAGEConv
        self.conv3 = SAGEConv(
            config.hidden_dim, 
            config.hidden_dim // 2,
            aggr=config.aggr
        )
        self.bn3 = BatchNorm(config.hidden_dim // 2)
        
        # Output layer
        self.lin = nn.Linear(config.hidden_dim // 2, config.out_dim)
        
        self.dropout_prob = config.dropout

    def forward(self, x: torch.Tensor, edge_index: torch.Tensor, edge_attr: torch.Tensor | None = None) -> torch.Tensor:
        """Forward pass of the model.
        
        Args:
            x: Node feature matrix of shape [N, in_features]
            edge_index: Graph connectivity matrix of shape [2, E]
            edge_attr: Edge feature matrix (optional)
            
        Returns:
            Raw logits of shape [N, out_dim]
        """
        # SAGEConv Layer 1
        x = self.conv1(x, edge_index)
        x = self.bn1(x)
        x = F.relu(x)
        x = F.dropout(x, p=self.dropout_prob, training=self.training)
        
        # GATv2Conv Layer
        if self.edge_dim is not None and edge_attr is not None:
            x = self.conv2(x, edge_index, edge_attr=edge_attr)
        else:
            x = self.conv2(x, edge_index)
        x = self.bn2(x)
        x = F.elu(x)
        x = F.dropout(x, p=self.dropout_prob, training=self.training)
        
        # SAGEConv Layer 2
        x = self.conv3(x, edge_index)
        x = self.bn3(x)
        x = F.relu(x)
        
        # Linear output layer
        x = self.lin(x)
        return x

    def predict_proba(self, x: torch.Tensor, edge_index: torch.Tensor, edge_attr: torch.Tensor | None = None) -> torch.Tensor:
        """Predict class probabilities.
        
        Args:
            x: Node feature matrix
            edge_index: Graph connectivity matrix
            edge_attr: Edge feature matrix
            
        Returns:
            Class probabilities (softmax output)
        """
        logits = self.forward(x, edge_index, edge_attr)
        return F.softmax(logits, dim=-1)


class FocalLoss(nn.Module):
    """Focal Loss for handling imbalanced dataset classification.
    
    FL(p_t) = -alpha_t * (1 - p_t)^gamma * log(p_t)
    """

    def __init__(self, gamma: float = 2.0, alpha: torch.Tensor | None = None) -> None:
        """Initialize FocalLoss.
        
        Args:
            gamma: Focusing parameter for modulating factor (1-p)
            alpha: Weighting factor for classes, shape [C]
        """
        super().__init__()
        self.gamma = gamma
        self.alpha = alpha

    def forward(self, logits: torch.Tensor, targets: torch.Tensor) -> torch.Tensor:
        """Compute the focal loss.
        
        Args:
            logits: Raw logits from model, shape [N, C]
            targets: Target labels, shape [N]
            
        Returns:
            Scalar loss tensor
        """
        ce_loss = F.cross_entropy(logits, targets, reduction='none', weight=self.alpha)
        pt = torch.exp(-ce_loss)
        focal_loss = ((1 - pt) ** self.gamma) * ce_loss
        return focal_loss.mean()
