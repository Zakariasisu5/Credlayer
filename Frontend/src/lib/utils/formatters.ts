/**
 * Number and currency formatting utilities
 */

export function formatUsd(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

export function formatNum(n: number): string {
  return n.toLocaleString("en-US");
}

export function formatCompactNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export function formatPercentage(n: number, decimals: number = 1): string {
  return `${n.toFixed(decimals)}%`;
}
