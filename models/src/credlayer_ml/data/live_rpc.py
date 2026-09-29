import httpx
import asyncio
import logging
from collections import defaultdict
from typing import Dict, List, Any

logger = logging.getLogger(__name__)

import os

# Default Helius or QuickNode RPC URL. Set this via environment variables in production.
SOLANA_RPC_URL = os.getenv("SOLANA_RPC_URL", "https://api.mainnet-beta.solana.com") 

async def rpc_call(client: httpx.AsyncClient, method: str, params: List[Any]) -> Any:
    """Helper to execute JSON-RPC calls."""
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": method,
        "params": params
    }
    response = await client.post(SOLANA_RPC_URL, json=payload)
    response.raise_for_status()
    data = response.json()
    if "error" in data:
        raise ValueError(f"RPC Error ({method}): {data['error']}")
    return data.get("result")

async def get_signatures(client: httpx.AsyncClient, address: str, limit: int = 100) -> List[str]:
    """Fetch recent transaction signatures for the target address."""
    params = [address, {"limit": limit}]
    result = await rpc_call(client, "getSignaturesForAddress", params)
    return [sig["signature"] for sig in result] if result else []

async def get_parsed_transactions(client: httpx.AsyncClient, signatures: List[str]) -> List[Dict]:
    """Fetch full transaction metadata for a list of signatures."""
    # Note: For production, chunkk these to avoid RPC rate limits (e.g., 20 at a time)
    tasks = [
        rpc_call(client, "getTransaction", [
            sig, 
            {"encoding": "jsonParsed", "maxSupportedTransactionVersion": 0}
        ])
        for sig in signatures
    ]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    # Filter out None values and failed requests
    valid_txs = [tx for tx in results if tx and not isinstance(tx, Exception)]
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

    # Edge map: (source, target) -> SOL volume (in lamports)
    edges = defaultdict(int)
    counterparties = set()

    for tx in transactions:
        meta = tx.get("meta")
        transaction_data = tx.get("transaction")
        
        if not meta or not transaction_data or meta.get("err"):
            continue # Skip failed transactions or missing metadata
            
        account_keys = transaction_data["message"]["accountKeys"]
        pre_balances = meta["preBalances"]
        post_balances = meta["postBalances"]
        
        # Identify who lost SOL (sender) and who gained SOL (receiver)
        balance_changes = []
        for i, key_info in enumerate(account_keys):
            pubkey = key_info["pubkey"]
            change = post_balances[i] - pre_balances[i]
            if change != 0:
                balance_changes.append({"pubkey": pubkey, "change": change})
                
        # Extremely simplified flow matching: 
        # Match negative balance changes (senders) to positive (receivers)
        # In a real DEX swap, this gets complex, but for SOL transfers it's direct.
        senders = [acc for acc in balance_changes if acc["change"] < 0]
        receivers = [acc for acc in balance_changes if acc["change"] > 0]
        
        for sender in senders:
            for receiver in receivers:
                # Only care about edges connected to our target address
                if sender["pubkey"] == target_address or receiver["pubkey"] == target_address:
                    amount = min(abs(sender["change"]), receiver["change"])
                    
                    edges[(sender["pubkey"], receiver["pubkey"])] += amount
                    counterparties.add(sender["pubkey"])
                    counterparties.add(receiver["pubkey"])

    # Format for the Polars pipeline
    formatted_edges = [
        {"source": src, "target": dst, "volume": vol} 
        for (src, dst), vol in edges.items()
    ]
    
    return {
        "target_address": target_address,
        "counterparties": list(counterparties),
        "edges": formatted_edges
    }