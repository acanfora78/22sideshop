# 22SIDE — tema Shopify (Online Store 2.0)

Porting in Liquid del sito Next.js: stessa grafica, intro "porta e chiave",
animazioni GSAP/Lenis, carrello a cassetto con l'Ajax API di Shopify, checkout
**vero** di Shopify (nessun checkout finto).

## Installazione

**Da admin (più semplice)**
1. Shopify admin → Negozio online → Temi → Aggiungi tema → **Carica file zip**.
2. Scegli `exports/22side-shopify-theme.zip`.
3. Anteprima → Pubblica.

**Da Shopify CLI**
```bash
shopify theme push --path shopify-theme --unpublished
```

## Dopo l'installazione

1. **Prodotti** — Prodotti → Importa → `exports/22side-prodotti-shopify.csv`.
   I prodotti arrivano come *bozza*, senza prezzo e con il tag
   `prezzo-da-confermare`: il tema mostra "Prezzo da confermare" e il pulsante
   "In arrivo", quindi nessuno può comprarli a 0 €. Quando inserisci prezzo e
   taglie, **togli il tag** e pubblica il prodotto.
2. **Collezioni** — crea Tops, Bottoms, Graphic Tees, Sets, Long Sleeve, New
   Arrivals (meglio automatiche, per tipo di prodotto o tag). Il tema mostra solo
   le collezioni che hanno almeno un prodotto.
3. **Menu** (Negozio online → Navigazione):
   - `main-menu` — header (es. Shop, Collezioni, About)
   - `footer` — colonne del footer (si scelgono nella sezione Footer)
4. **Editor del tema** — ogni sezione della home è modificabile (testi, immagini,
   capitoli di Underground Culture, sticker dell'intro). L'intro si può spegnere
   dalla sezione "Intro — porta e chiave".

## Struttura

| Cartella | Contenuto |
|---|---|
| `layout/theme.liquid` | head, font, header/footer/carrello, script |
| `sections/` | intro-door, hero, manifesto, marquee, why-22, featured-products (The Store), underground-culture, collection-list, final-statement + pagine (main-product, main-collection, main-cart, main-search, …) |
| `snippets/` | product-card, price, cart-line, cart-summary, icon, logo, door-scene (SVG generato) |
| `assets/` | `theme.css` (compilato), `theme.js`, GSAP, ScrollTrigger, Lenis, immagini |
| `locales/it.default.json` | tutte le stringhe dell'interfaccia in italiano |

## Rigenerare gli asset

`theme.css` è compilato con Tailwind a partire dai file Liquid; la scena della
porta è generata dal componente React del sito.

```bash
bash scripts/theme/build.sh --zip
```

Anteprima locale senza negozio (render approssimato con liquidjs):
`npx tsx scripts/theme/preview.mts <cartella node_modules con liquidjs> <cartella output>`.
