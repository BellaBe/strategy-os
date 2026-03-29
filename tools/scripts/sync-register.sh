#!/bin/bash
# sync-register.sh — Syncs strategy/hypotheses.md to dashboard/public/register.json
# Runs the TypeScript parser to convert markdown into structured JSON.
#
# Usage:
#   ./tools/scripts/sync-register.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

HYPOTHESES_PATH="$PROJECT_ROOT/strategy/hypotheses.md"
OUTPUT_PATH="$PROJECT_ROOT/tools/dashboard/public/register.json"

if [ ! -f "$HYPOTHESES_PATH" ]; then
  echo "ERROR: $HYPOTHESES_PATH not found" >&2
  exit 1
fi

echo "Parsing hypothesis register..."

cd "$PROJECT_ROOT/tools/dashboard"

npx tsx -e "
import { parse } from './src/parser/index.ts';
import { readFileSync, writeFileSync } from 'fs';

const md = readFileSync('$HYPOTHESES_PATH', 'utf-8');
const result = parse(md);

writeFileSync('$OUTPUT_PATH', JSON.stringify(result, null, 2));

console.log('Parse completeness: ' + (result.parseCompleteness * 100) + '%');
console.log('Warnings: ' + result.warnings.length);
console.log('Written to $OUTPUT_PATH');
"

echo "Done. $(wc -c < "$OUTPUT_PATH") bytes"
