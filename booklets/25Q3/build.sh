#!/bin/bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "$0")" && pwd)
cd "$ROOT_DIR"

OUTPUT_HTML="25Q3.html"
OUTPUT_PDF="25Q3.pdf"

FILES=(toc.md p1.md p2.md p3.md p4.md p5.md p6.md p7.md p8.md p9.md p10.md p11.md p12.md p13.md p14.md)

if command -v pandoc >/dev/null 2>&1; then
  echo "Building HTML..."
  pandoc -s -o "$OUTPUT_HTML" "${FILES[@]}"
  if command -v xelatex >/dev/null 2>&1; then
    echo "Building PDF..."
    pandoc --toc --pdf-engine=xelatex -o "$OUTPUT_PDF" "${FILES[@]}"
  else
    echo "Skipping PDF (xelatex not found)."
  fi
else
  echo "Pandoc not found. Install pandoc to build booklet (https://pandoc.org)."
  exit 1
fi
