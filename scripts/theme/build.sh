#!/usr/bin/env bash
# Rebuild the Shopify theme assets from this repo.
#   bash scripts/theme/build.sh          → theme.css + vendor JS + door-scene snippet
#   bash scripts/theme/build.sh --zip    → also exports/22side-shopify-theme.zip
set -euo pipefail
cd "$(dirname "$0")/../.."
npx --yes @tailwindcss/cli@4 -i scripts/theme/theme.css -o shopify-theme/assets/theme.css --minify
cp node_modules/gsap/dist/gsap.min.js node_modules/gsap/dist/ScrollTrigger.min.js shopify-theme/assets/
cp node_modules/lenis/dist/lenis.min.js shopify-theme/assets/
bash scripts/theme/build-door.sh
if [[ "${1:-}" == "--zip" ]]; then
  mkdir -p exports && rm -f exports/22side-shopify-theme.zip
  (cd shopify-theme && zip -qr ../exports/22side-shopify-theme.zip assets config layout locales sections snippets templates)
  echo "→ exports/22side-shopify-theme.zip"
fi
