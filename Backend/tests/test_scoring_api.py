"""Unit tests for scoring schemas and logic."""
import unittest
from credlayer.schemas.common import CamelModel, Pagination
from credlayer.api.envelope import ok, paginated, error_envelope, Envelope


class TestEnvelopeAndSchemas(unittest.TestCase):
    def test_camel_model_serialization(self):
        class SampleModel(CamelModel):
            trust_score: int
            risk_level: str
            fraud_probability: float

        obj = SampleModel(trust_score=850, risk_level="minimal", fraud_probability=0.15)
        dumped = obj.model_dump(by_alias=True)
        self.assertIn("trustScore", dumped)
        self.assertIn("riskLevel", dumped)
        self.assertIn("fraudProbability", dumped)
        self.assertEqual(dumped["trustScore"], 850)

    def test_ok_envelope(self):
        env = ok(data={"status": "scored"}, message="Wallet analyzed")
        self.assertTrue(env.success)
        self.assertEqual(env.data, {"status": "scored"})
        self.assertEqual(env.message, "Wallet analyzed")
        self.assertTrue(env.timestamp.endswith("Z"))

    def test_paginated_envelope(self):
        pagination = Pagination(
            page=1,
            limit=10,
            total=50,
            total_pages=5,
            has_next=True,
            has_prev=False,
        )
        env = paginated(items=[{"id": 1}], pagination=pagination)
        self.assertTrue(env.success)
        self.assertEqual(len(env.data), 1)
        self.assertEqual(env.pagination.total_pages, 5)

    def test_error_envelope(self):
        err = error_envelope(
            code="NOT_FOUND",
            message="Wallet address not recognized",
            status_code=404,
            details={"address": "0x123"},
        )
        self.assertFalse(err.success)
        self.assertEqual(err.error.code, "NOT_FOUND")
        self.assertEqual(err.error.status_code, 404)


class TestScoringLevels(unittest.TestCase):
    def test_score_mapping_logic(self):
        # Test trust score and risk level mapping heuristics
        def get_trust_level(score: int) -> str:
            if score <= 250:
                return "critical"
            elif score <= 500:
                return "low"
            elif score <= 750:
                return "medium"
            return "high"

        def get_risk_level(trust_level: str) -> str:
            inverse_map = {
                "critical": "high",
                "low": "medium",
                "medium": "low",
                "high": "minimal",
            }
            return inverse_map.get(trust_level, "unknown")

        self.assertEqual(get_trust_level(100), "critical")
        self.assertEqual(get_risk_level("critical"), "high")

        self.assertEqual(get_trust_level(842), "high")
        self.assertEqual(get_risk_level("high"), "minimal")

        self.assertEqual(get_trust_level(600), "medium")
        self.assertEqual(get_risk_level("medium"), "low")


if __name__ == "__main__":
    unittest.main()
