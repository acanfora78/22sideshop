#!/usr/bin/env bash
# Builds the legal texts from docs/legal/*.md:
#  - shopify-theme/snippets/legal-<key>.liquid  → shown by the theme at /?view=<key> (section legal-document)
#  - docs/legal/html/*.html + anteprima.html     → paste-ready copies (e.g. for Settings › Policies)
# Only the part after "<!-- TESTO -->" is published; the H1 is dropped (the page shows its own title).
#   bash scripts/legal/build.sh
set -euo pipefail
cd "$(dirname "$0")/../.."
out=docs/legal/html
mkdir -p "$out"

key_of() {
  case "$1" in
    01-*) echo condizioni ;; 02-*) echo resi ;; 03-*) echo spedizioni ;; 04-*) echo privacy ;;
    05-*) echo cookie ;; 06-*) echo venditore ;; 07-*) echo garanzia ;; 08-*) echo accessibilita ;;
    09-*) echo recesso ;; *) echo "" ;;
  esac
}

index=""
for md in docs/legal/0*.md; do
  name=$(basename "$md" .md)
  key=$(key_of "$name")
  body=$(awk '/<!-- TESTO -->/{f=1;next} /<!-- FINE TESTO -->/{f=0} f' "$md" | sed '0,/^# /{/^# /d}')
  title=$(awk '/<!-- TESTO -->/{f=1;next} f && /^# /{sub(/^# /,"");print;exit}' "$md")
  printf '%s\n' "$body" | pandoc -f gfm -t html --wrap=none -o "$out/$name.html"
  index+="<section><h1 style=\"font:700 28px/1.2 system-ui;margin:48px 0 8px\">$title</h1>$(cat "$out/$name.html")</section><hr>"

  # Theme snippet: same text, links pointing at the theme's legal views.
  {
    echo "{%- comment -%} Generated from docs/legal/$name.md by scripts/legal/build.sh — edit the .md, not this file. {%- endcomment -%}"
    sed -e 's#href="/policies/terms-of-service"#href="{{ routes.root_url }}?view=condizioni"#g' \
        -e 's#href="/policies/refund-policy"#href="{{ routes.root_url }}?view=recesso\#doc-resi"#g' \
        -e 's#href="/policies/shipping-policy"#href="{{ routes.root_url }}?view=spedizioni"#g' \
        -e 's#href="/policies/privacy-policy"#href="{{ routes.root_url }}?view=privacy"#g' \
        -e 's#href="/pages/cookie"#href="{{ routes.root_url }}?view=cookie"#g' \
        -e 's#href="/pages/garanzia"#href="{{ routes.root_url }}?view=garanzia"#g' \
        -e 's#href="/pages/recesso"#href="{{ routes.root_url }}?view=recesso"#g' \
        -e 's#href="/pages/contact"#href="{{ routes.root_url }}pages/contact"#g' \
        "$out/$name.html"
  } > "shopify-theme/snippets/legal-$key.liquid"
done

cat > "$out/anteprima.html" <<EOF
<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>22SIDE — testi legali</title>
<style>body{max-width:760px;margin:0 auto;padding:24px 16px;font:17px/1.7 Georgia,serif;color:#111;background:#fff}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:6px 8px;text-align:left;vertical-align:top}h2{font:700 21px/1.3 system-ui;margin-top:2em}</style></head>
<body><p style="font:14px system-ui;background:#fff3cd;padding:12px">I testi sono già nel tema (/?view=…). Questa copia serve solo se vuoi incollarli anche in Impostazioni › Policy, per i link nel checkout.</p>$index</body></html>
EOF
echo "→ $out e shopify-theme/snippets/legal-*.liquid"
