#!/bin/bash
# sync-sdk.sh — Rebuild and vendor the @credlayer/sdk into the Frontend.
# Run this after making changes to blockchain/sdk source code.
#
# Usage:
#   ./scripts/sync-sdk.sh          (build + copy)
#   ./scripts/sync-sdk.sh --skip-build  (copy only, if you already built)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="$(dirname "$SCRIPT_DIR")"
SDK_DIR="$(cd "$FRONTEND_DIR/../blockchain/sdk" && pwd)"
VENDOR_DIR="$FRONTEND_DIR/lib/credlayer-sdk"

echo "🔧 CredLayer SDK Sync"
echo "   SDK source:  $SDK_DIR"
echo "   Vendor dest: $VENDOR_DIR"

# Step 1: Build (unless --skip-build)
if [[ "${1:-}" != "--skip-build" ]]; then
  echo ""
  echo "📦 Building SDK..."
  (cd "$SDK_DIR" && npm run build)
else
  echo ""
  echo "⏭️  Skipping build (--skip-build)"
fi

# Step 2: Copy dist files
echo ""
echo "📋 Copying dist files..."
mkdir -p "$VENDOR_DIR"
cp "$SDK_DIR/dist/index.js"    "$VENDOR_DIR/index.js"
cp "$SDK_DIR/dist/index.mjs"   "$VENDOR_DIR/index.mjs"
cp "$SDK_DIR/dist/index.d.ts"  "$VENDOR_DIR/index.d.ts"
cp "$SDK_DIR/dist/index.d.mts" "$VENDOR_DIR/index.d.mts"

echo ""
echo "✅ SDK vendored successfully!"
echo "   Files: $(ls -1 "$VENDOR_DIR" | grep -v package.json | tr '\n' ', ')"
echo "   Total: $(du -sh "$VENDOR_DIR" | cut -f1)"
