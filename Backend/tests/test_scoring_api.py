"""Unit tests for scoring schemas and logic."""

import unittest
from types import SimpleNamespace
from unittest.mock import AsyncMock

import httpx
from fastapi import HTTPException

from credlayer.api.envelope import error_envelope, ok, paginated
from credlayer.api.v1.scores import WalletScorer, score_and_attest
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

    async def test_existing_attestation_is_reused_and_verified(self):
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
            settings=SimpleNamespace(relayer_service_url="https://relayer.example"),
            score_address=AsyncMock(return_value=score),
        )
        requests = []

        class MockClient:
            def __init__(self, **_kwargs):
                pass

            async def __aenter__(self):
                return self

            async def __aexit__(self, *_args):
                return None

            async def get(self, url):
                requests.append(("GET", url))
                response = httpx.Response(
                    200,
                    json={
                        "success": True,
                        "data": {
                            "verified": True,
                            "attestation": {"trustScore": 700, "riskLevel": "LOW"},
                        },
                    },
                )
                response.request = httpx.Request("GET", url)
                return response

            async def post(self, *_args, **_kwargs):
                self.fail("Existing attestation must not be issued again")

        from unittest.mock import patch

        with patch("credlayer.api.v1.scores.httpx.AsyncClient", MockClient):
            response = await score_and_attest(address, scorer)
            events = [event async for event in response.body_iterator]

        body = "".join(events)
        self.assertIn('"alreadyExisted":true', body)
        self.assertIn('"trustScore":700', body)
        self.assertIn("event: result", body)
        self.assertEqual(len(requests), 1)
        scorer.score_address.assert_not_awaited()

    async def test_relayer_failure_does_not_emit_success(self):
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
            settings=SimpleNamespace(relayer_service_url="https://relayer.example"),
            score_address=AsyncMock(return_value=score),
        )

        class MockClient:
            def __init__(self, **_kwargs):
                pass

            async def __aenter__(self):
                return self

            async def __aexit__(self, *_args):
                return None

            async def get(self, url):
                response = httpx.Response(200, json={"success": True, "data": {"verified": False}})
                response.request = httpx.Request("GET", url)
                return response

            async def post(self, url, **_kwargs):
                response = httpx.Response(503, json={"error": "internal relayer detail"})
                response.request = httpx.Request("POST", url)
                return response

        from unittest.mock import patch

        with patch("credlayer.api.v1.scores.httpx.AsyncClient", MockClient):
            response = await score_and_attest(address, scorer)
            events = [event async for event in response.body_iterator]

        body = "".join(events)
        self.assertIn('"code":"attestation"', body)
        self.assertNotIn("event: result", body)
        self.assertNotIn("internal relayer detail", body)

    async def test_new_wallet_is_scored_issued_and_verified(self):
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
            settings=SimpleNamespace(relayer_service_url="https://relayer.example"),
            score_address=AsyncMock(return_value=score),
        )
        requests = []

        class MockClient:
            def __init__(self, **_kwargs):
                pass

            async def __aenter__(self):
                return self

            async def __aexit__(self, *_args):
                return None

            async def get(self, url):
                requests.append(("GET", url))
                verified = len([request for request in requests if request[0] == "GET"]) > 1
                data = {
                    "verified": verified,
                    "attestation": {"trustScore": 731, "riskLevel": "LOW"} if verified else None,
                }
                response = httpx.Response(200, json={"success": True, "data": data})
                response.request = httpx.Request("GET", url)
                return response

            async def post(self, url, json):
                requests.append(("POST", url, json))
                response = httpx.Response(200, json={"success": True, "alreadyExists": False})
                response.request = httpx.Request("POST", url)
                return response

        from unittest.mock import patch

        with patch("credlayer.api.v1.scores.httpx.AsyncClient", MockClient):
            response = await score_and_attest(address, scorer)
            events = [event async for event in response.body_iterator]

        body = "".join(events)
        self.assertEqual(requests[1][0], "POST")
        self.assertEqual(requests[1][2]["trustScore"], 731)
        self.assertEqual(requests[1][2]["riskLevel"], "LOW")
        self.assertIn('"trustScore":731', body)
        self.assertIn('"verified":true', body)
        self.assertIn("event: result", body)

    async def test_verification_read_failure_is_not_reported_as_issuance_success(self):
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
            settings=SimpleNamespace(relayer_service_url="https://relayer.example"),
            score_address=AsyncMock(return_value=score),
        )
        get_count = 0

        class MockClient:
            def __init__(self, **_kwargs):
                pass

            async def __aenter__(self):
                return self

            async def __aexit__(self, *_args):
                return None

            async def get(self, url):
                nonlocal get_count
                get_count += 1
                if get_count == 1:
                    response = httpx.Response(
                        200, json={"success": True, "data": {"verified": False}}
                    )
                else:
                    response = httpx.Response(503, json={"error": "internal RPC failure"})
                response.request = httpx.Request("GET", url)
                return response

            async def post(self, url, **_kwargs):
                response = httpx.Response(200, json={"success": True, "alreadyExists": False})
                response.request = httpx.Request("POST", url)
                return response

        from unittest.mock import patch

        with patch("credlayer.api.v1.scores.httpx.AsyncClient", MockClient):
            response = await score_and_attest(address, scorer)
            events = [event async for event in response.body_iterator]

        body = "".join(events)
        self.assertIn('"code":"verification"', body)
        self.assertNotIn("event: result", body)
        self.assertNotIn("internal RPC failure", body)


if __name__ == "__main__":
    unittest.main()
