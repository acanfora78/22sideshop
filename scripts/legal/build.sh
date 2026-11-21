#!/usr/bin/env bash
# Builds paste-ready HTML from docs/legal/*.md.
# Only the part after "<!-- TESTO -->" (and before "<!-- FINE TESTO -->", if present) is published;
# the H1 is dropped because Shopify shows the policy/page title itself.
#   bash scripts/legal/build.sh
set -euo pipefail
cd "$(dirname "$0")/../.."
out=docs/legal/html
mkdir -p "$out"
index=""
for md in docs/legal/0*.md; do
  name=$(basename "$md" .md)
  body=$(awk '/<!-- TESTO -->/{f=1;next} /<!-- FINE TESTO -->/{f=0} f' "$md" | sed '0,/^# /{/^# /d}')
  title=$(awk '/<!-- TESTO -->/{f=1;next} f && /^# /{sub(/^# /,"");print;exit}' "$md")
  printf '%s\n' "$body" | pandoc -f gfm -t html --wrap=none -o "$out/$name.html"
  index+="<section><h1 style=\"font:700 28px/1.2 system-ui;margin:48px 0 8px\">$title</h1><p style=\"color:#a00;font:13px system-ui\">BOZZA — da validare con avvocato/commercialista prima della pubblicazione. Fonte: $name.md</p>$(cat "$out/$name.html")</section><hr>"
done
cat > "$out/anteprima.html" <<EOF
<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>22SIDE — testi legali (bozza)</title>
<style>body{max-width:760px;margin:0 auto;padding:24px 16px;font:17px/1.7 Georgia,serif;color:#111;background:#fff}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:6px 8px;text-align:left;vertical-align:top}h2{font:700 21px/1.3 system-ui;margin-top:2em}</style></head>
<body><p style="font:14px system-ui;background:#fff3cd;padding:12px">Apri questa pagina nel browser, seleziona il testo di un documento e incollalo nell'editor di Shopify: titoli, elenchi e tabelle restano formattati.</p>$index</body></html>
EOF
echo "→ $out ($(ls "$out" | wc -l) file)"
