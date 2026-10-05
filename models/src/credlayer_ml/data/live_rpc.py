import httpx
import asyncio
import logging
import os
from collections import defaultdict
from typing import Dict, List, Any

logger = logging.getLogger(__name__)


def get_solana_rpc_url() -> str:
    """Return the configured Solana RPC endpoint for production use.

    The public mainnet-beta endpoint is intentionally not used as a default here.
    A paid/private RPC is required to avoid 429 rate limiting in production.
    """
    rpc_url = os.getenv("SOLANA_RPC_URL")
    if not rpc_url:
        raise RuntimeError(
            "SOLANA_RPC_URL is not configured. Set a private Solana RPC endpoint "
            "(Helius, QuickNode, Triton, or your own RPC) in Railway or your local .env file."
        )
    return rpc_url.rstrip("/")


async def rpc_call(client: httpx.AsyncClient, method: str, params: List[Any]) -> Any:
    """Helper to execute JSON-RPC calls with retries and backoff."""
    rpc_url = get_solana_rpc_url()
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": method,
        "params": params,
    }

    for attempt in range(5):
        response = await client.post(rpc_url, json=payload)

        if response.status_code == 429:
            delay = min(2 ** attempt + 1, 10)
            logger.warning(
                "Solana RPC rate limited for %s; retrying in %ss (attempt %s/5)",
                method,
                delay,
                attempt + 1,
            )
            await asyncio.sleep(delay)
            continue

        response.raise_for_status()
        data = response.json()
        if "error" in data:
            raise ValueError(f"RPC Error ({method}): {data['error']}")
        return data.get("result")

    raise RuntimeError(f"Solana RPC exhausted retries for {method}")


async def get_signatures(client: httpx.AsyncClient, address: str, limit: int = 100) -> List[str]:
    """Fetch recent transaction signatures for the target address."""
    params = [address, {"limit": limit}]
    result = await rpc_call(client, "getSignaturesForAddress", params)
    return [sig["signature"] for sig in result] if result else []


async def get_parsed_transactions(client: httpx.AsyncClient, signatures: List[str]) -> List[Dict]:
    """Fetch full transaction metadata for a list of signatures in small batches."""
    valid_txs: List[Dict] = []
    batch_size = 10

    for i in range(0, len(signatures), batch_size):
        batch = signatures[i : i + batch_size]
        tasks = [
            rpc_call(client, "getTransaction", [
                sig,
                {"encoding": "jsonParsed", "maxSupportedTransactionVersion": 0},
            ])
            for sig in batch
        ]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        valid_txs.extend(tx for tx in results if tx and not isinstance(tx, Exception))

    return valid_txs


async def fetch_live_context(target_address: str, tx_limit: int = 50) -> Dict:
    """
    Builds the 1-hop ego-graph raw data for an unseen wallet.
    Returns counterparties and edge volumes.
    """
    logger.info(f"Fetching live context for {target_address}...")

    async with httpx.AsyncClient(timeout=15.0) as client:
        signatures = await get_signatures(client, target_address, limit=tx_limit)

        if not signatures:
            return {
                "target_address": target_address,
                "counterparties": [],
                "edges": [],
            }

        transactions = await get_parsed_transactions(client, signatures)

    edges = defaultdict(int)
    counterparties = set()

    for tx in transactions:
        meta = tx.get("meta")
        transaction_data = tx.get("transaction")

        if not meta or not transaction_data or meta.get("err"):
            continue  # Skip failed transactions or missing metadata

        account_keys = transaction_data["message"]["accountKeys"]
        pre_balances = meta["preBalances"]
        post_balances = meta["postBalances"]

        balance_changes = []
        for i, key_info in enumerate(account_keys):
            pubkey = key_info["pubkey"]
            change = post_balances[i] - pre_balances[i]
            if change != 0:
                balance_changes.append({"pubkey": pubkey, "change": change})

        senders = [acc for acc in balance_changes if acc["change"] < 0]
        receivers = [acc for acc in balance_changes if acc["change"] > 0]

        for sender in senders:
            for receiver in receivers:
                if sender["pubkey"] == target_address or receiver["pubkey"] == target_address:
                    amount = min(abs(sender["change"]), receiver["change"])

                    edges[(sender["pubkey"], receiver["pubkey"])] += amount
                    counterparties.add(sender["pubkey"])
                    counterparties.add(receiver["pubkey"])

    formatted_edges = [
        {"source": src, "target": dst, "volume": vol}
        for (src, dst), vol in edges.items()
    ]

    return {
        "target_address": target_address,
        "counterparties": list(counterparties),
        "edges": formatted_edges,
    }
