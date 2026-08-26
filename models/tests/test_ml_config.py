"""Unit tests for standalone credlayer_ml configuration."""
import unittest

from credlayer_ml.config import (
    InferenceConfig,
    ModelConfig,
    PathConfig,
    PipelineConfig,
    ServerSettings,
    TrainingConfig,
    get_default_config,
)


class TestMLConfig(unittest.TestCase):
    def test_default_config(self):
        cfg = get_default_config()
        self.assertIsInstance(cfg, PipelineConfig)
        self.assertIsInstance(cfg.paths, PathConfig)
        self.assertIsInstance(cfg.model, ModelConfig)
        self.assertIsInstance(cfg.training, TrainingConfig)
        self.assertIsInstance(cfg.inference, InferenceConfig)

    def test_paths(self):
        cfg = get_default_config()
        self.assertTrue(str(cfg.paths.data_root).endswith("data"))
        self.assertTrue(str(cfg.paths.graph_path).endswith("fraud_graph.pt"))
        self.assertTrue(str(cfg.paths.best_model_path).endswith("fraud_gnn_best.pt"))

    def test_server_settings(self):
        settings = ServerSettings()
        self.assertEqual(settings.port, 8001)
        self.assertEqual(settings.host, "0.0.0.0")


if __name__ == "__main__":
    unittest.main()
