"""Unit tests for scoring schemas and logic."""

import unittest
from types import SimpleNamespace
from unittest.mock import AsyncMock

import httpx
from fastapi import HTTPException

from credlayer.api.envelope import error_envelope, ok, paginated
from credlayer.api.v1.scores import WalletScorer, issue_attestation, score_wallet
from credlayer.schemas.common import CamelModel, Pagination


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


class TestProductionScoringFlow(unittest.IsolatedAsyncioTestCase):
    async def test_missing_ml_url_fails_closed(self):
        scorer = WalletScorer()
        scorer.settings = SimpleNamespace(ml_service_url=None)

        with self.assertRaises(HTTPException) as error:
            await scorer.score_address("11111111111111111111111111111111")

        self.assertEqual(error.exception.status_code, 503)

    async def test_explicit_attestation_endpoint_returns_success_payload(self):
        address = "11111111111111111111111111111111"
        score = {
            "address": address,
            "trust_score": 731,
            "trust_level": "medium",
            "risk_level": "low",
            "confidence": 0.8,
            "fraud_probability": 0.2,
            "network": "solana",
            "explanation": "Model-derived score",
        }
        scorer = SimpleNamespace(
            settings=SimpleNamespace(relayer_url="https://relayer.example"),
            score_address=AsyncMock(return_value=score),
        )

        class MockClient:
            def __init__(self, **_kwargs):
                pass

            async def __aenter__(self):
                return self

            async def __aexit__(self, *_args):
                return None

            async def post(self, url, json):
                assert url == "https://relayer.example/api/v1/attestations/issue"
                assert json["targetWallet"] == address
                response = httpx.Response(
                    200,
                    json={"success": True, "txHash": "0xabc123", "alreadyExists": False},
                )
                response.request = httpx.Request("POST", url)
                return response

        from unittest.mock import patch

        with patch("credlayer.api.v1.scores.httpx.AsyncClient", MockClient):
            response = await issue_attestation(address, scorer)

        self.assertTrue(response["success"])
        self.assertEqual(response["txHash"], "0xabc123")
        scorer.score_address.assert_awaited_once_with(address)

    async def test_score_read_has_no_side_effects(self):
        address = "11111111111111111111111111111111"
        score = {
            "address": address,
            "trust_score": 731,
            "trust_level": "medium",
            "risk_level": "low",
            "confidence": 0.8,
            "fraud_probability": 0.2,
            "network": "solana",
            "explanation": "Model-derived score",
        }
        scorer = SimpleNamespace(
            settings=SimpleNamespace(relayer_url="https://relayer.example"),
            score_address=AsyncMock(return_value=score),
        )

        response = await score_wallet(address, scorer)

        self.assertEqual(response.data.trust_score, 731)
        self.assertEqual(response.data.risk_level, "low")
        scorer.score_address.assert_awaited_once_with(address)

    async def test_attestation_failure_returns_specific_error(self):
        address = "11111111111111111111111111111111"
        score = {
            "address": address,
            "trust_score": 731,
            "trust_level": "medium",
            "risk_level": "low",
            "confidence": 0.8,
            "fraud_probability": 0.2,
            "network": "solana",
            "explanation": "Model-derived score",
        }
        scorer = SimpleNamespace(
            settings=SimpleNamespace(relayer_url="https://relayer.example"),
            score_address=AsyncMock(return_value=score),
        )

        class MockClient:
            def __init__(self, **_kwargs):
                pass

            async def __aenter__(self):
                return self

            async def __aexit__(self, *_args):
                return None

            async def post(self, url, json):
                response = httpx.Response(503, json={"error": "Relayer unavailable"})
                response.request = httpx.Request("POST", url)
                return response

        from unittest.mock import patch

        with patch("credlayer.api.v1.scores.httpx.AsyncClient", MockClient):
            with self.assertRaises(HTTPException) as error:
                await issue_attestation(address, scorer)

        self.assertEqual(error.exception.status_code, 503)
        self.assertIn("Relayer unavailable", str(error.exception.detail))


if __name__ == "__main__":
    unittest.main()
