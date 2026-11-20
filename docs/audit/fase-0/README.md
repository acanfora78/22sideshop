# 22SIDE — Fase 0: analisi del tema e piano

Data: 20/11/2026 · Tema analizzato: `shopify-theme/` (commit `4c21f36`) · Riferimento visivo: https://22sideshop.vercel.app (stesso codice del repo, cartella `src/`).

> **Limite di questo audit.** Questo ambiente non ha accesso a un negozio Shopify: non è stato possibile eseguire
> `shopify theme dev`, elencare le app installate, né misurare Lighthouse sul tema servito da Shopify.
> Le misure qui sotto sono fatte su un **render locale del tema** (`scripts/theme/preview.mts`: Liquid reso con
> liquidjs e dati finti dei 12 prodotti, servito senza CDN né compressione). Accessibilità, layout e overflow
> sono affidabili; le metriche di performance sono indicative e vanno ripetute sul tema di sviluppo Shopify.

## 1. Mappa del tema

| Cartella | File |
|---|---|
| `layout/` | `theme.liquid` |
| `templates/` | `index`, `product`, `collection`, `list-collections`, `cart`, `search`, `page`, `404` (JSON) + `gift_card.liquid` |
| `sections/` | intro-door, header, hero, manifesto, marquee, why-22, featured-products (The Store), underground-culture, collection-list, final-statement, footer, cart-drawer, main-product, product-recommendations, main-collection, main-list-collections, main-cart, main-search, main-page, main-404 |
| `snippets/` | meta-tags, logo, icon, line-bullet, section-label, price, product-card, cart-line, cart-summary, door-scene (SVG generato) |
| `assets/` | theme.css (Tailwind compilato), theme.js, gsap, ScrollTrigger, lenis, 10 immagini |
| `locales/` | `it.default.json` |
| `config/` | `settings_schema.json`, `settings_data.json` |

App e script iniettati: **non verificabili senza accesso al negozio**. Nel tema non ci sono script di terze parti; carica Google Fonts da remoto.

## 2. Theme check

Nessun errore. 6 avvisi `RemoteAsset` (Google Fonts in `layout/theme.liquid` e `gift_card.liquid`). Report: `theme-check.txt`.

## 3. Lighthouse (render locale, indicativo)

| Pagina | Mobile perf / a11y / BP / SEO | LCP mobile | CLS desktop |
|---|---|---|---|
| Home | 75 / 93 / 96 / 83 | 4,9 s | **0,168** |
| Catalogo (`/collections/all`) | 73 / 91 / 96 / 83 | 6,2 s | **0,21** |
| Heaven Tee | 86 / 92 / 96 / 83 | 3,8 s | 0,016 |
| Carrello | 97 / 92 / 93 / 82 | 2,4 s | 0,007 |

JSON completi in `docs/audit/lighthouse-before/`. "Collezione Drop 001" non esiste né nel tema né nel sito Vercel: misurato il catalogo.

## 4. Accessibilità (axe, WCAG 2.2 AA)

| Problema | Gravità | Dove |
|---|---|---|
| Contrasto insufficiente: `#777` (concrete) e `#8b1717` (blood) su `#080808` | serious | ovunque: 45 nodi in home, 32 nel catalogo, breadcrumb, numeri di sezione, etichette |
| `aria-label` su `<span>` del logo (attributo non permesso) | serious | logo in tutte le pagine |
| Target touch < 44 px | — | 12–21 per pagina (quantità, rimuovi, chip collezioni, link footer, chiudi drawer) |

Dettaglio: `docs/audit/axe-before/axe-and-checks.json`.

## 5. Layout (screenshot a 375 / 390 / 768 / 1280 / 1920 px in `screenshots/`)

- **Card prodotto a 375–390 px:** "Prezzo da confermare" non va a capo e si sovrappone al tipo prodotto; il titolo si spezza parola per parola (vedi `collezione-375.webp`). Causa anche l'overflow orizzontale di 3 px.
- **Home a 768 px:** overflow di 11 px da una parola del titolo troppo lunga per la colonna.
- **Intro:** 5,5 s prima del titolo; blocca lo scroll finché non si clicca; si ripete in ogni nuova scheda (usa `sessionStorage`); "Salta intro" è l'ultimo elemento nel DOM, non il primo focalizzabile.
- Nessun testo tagliato nelle altre pagine; il drawer del carrello è fuori schermo ma non crea overflow visibile.

## 6. Confronto con l'anteprima Vercel e verifica del brief

| Punto del brief | Situazione reale |
|---|---|
| "Pareti delle collezioni", "sei pareti" | Rimosse su tua richiesta prima del porting; non ci sono né su Vercel né nel tema. **Non le reintroduco** salvo tua indicazione. |
| "Intro a capitoli" | Vercel e tema usano l'intro porta-e-chiave (tua scelta). Il film Kling a 7 capitoli è nel repo ma non attivo. |
| 14 prodotti, codici 22-01…22-14 | Sono **12** (14 foto, due coordinati uniti in Cargo Set e Faded Tracksuit). Codici 22-01…22-12. Vercel mostra i codici, **il tema no**. |
| Baggy Jeans Vintage Blue con retro della Eternity Tee | Confermato: stessa foto (`eternity-tee-back`). Lo scatto mostra davvero entrambi i capi di spalle, ma serve una foto dedicata. |
| Heaven Tee, Fig. 02 "Retro" che mostra l'outfit | Confermato su Vercel (didascalia calcolata dalla posizione). Nel tema le didascalie Fig. non ci sono proprio. |
| Numerazioni incoerenti | Su Vercel: menu 01–04 vs sezioni 02–06. Nel tema i numeri del menu vengono dalla posizione nel menu, quelli delle sezioni dalle impostazioni: stesso rischio. |
| "Drop 001" | Esiste solo come testo in `src/content/site.ts`; nessuna collezione. |
| "Cerca è 06" | Nel tema la ricerca non ha numero. |
| "2222 Side St." | Non esiste. Ci sono "22 Side St." (intro, footer) e coordinate `40.6782° N — 73.9442° W` (Brooklyn) nell'hero: possono sembrare un recapito → da rendere chiaramente narrativi. |
| "Nessun dato viene salvato" | Solo nella newsletter di Vercel. Il tema usa già `{% form 'customer' %}`, ma **senza checkbox di consenso** né link alla privacy. |
| Audio | Nessun audio né su Vercel né nel tema: §9.7 non applicabile. |
| Claim "cresciuto nell'underground di New York" | Presente nell'hero di entrambi → da riformulare (§5). |
| Dati legali e footer | Il footer non contiene dati del venditore, P.IVA, link alle policy, icone pagamento, link preferenze cookie. |
| Pagine mancanti nel tema | About ("Chi siamo"), Novità, Contatti, pagine legali, guida taglie, FAQ, template `policy`. |

## 7. Piano proposto (ordine di esecuzione)

Ogni attività = un commit; `theme check` pulito alla fine di ogni fase.

**Fase 1 — correzioni rapide**
1. Card prodotto mobile (prezzo/titolo), overflow 375/768.
2. Contrasti: schiarire `concrete` e `blood` per il testo (≥ 4,5:1) senza toccare la palette di superficie; logo con `role="img"`.
3. Didascalie Fig. dal metafield `immagini_didascalie` o dall'alt del media; codici 22-XX dal metafield `codice` su card e scheda.
4. Numerazione da un'unica fonte: metaobject `linea` + conteggi da `collection.products_count`.
5. Nomi accessibili di card e immagini; verifica H1 "The Movement".
6. Ordinamento/filtro disponibilità solo con prodotti acquistabili; stato vuoto nel tono del brand.
7. Jeans Vintage Blue: serve la foto del retro (vedi domande).

**Fase 2 — pronto a vendere**: scheda prodotto completa (§4.1: guida taglie da metaobject, sticky CTA, dynamic checkout, tab composizione/cura/GPSR, prezzo minimo 30 gg, abbinamenti, avvisami), carrello con barra spedizione gratuita, newsletter con consenso, footer con dati venditore e policy, pagina contatti, intro con `localStorage` + skip per primo + nessun blocco dello scroll.

**Fase 3 — copy** (`docs/copy/`, `docs/brand-voice.md`, claim di origine), **Fase 4 — testi legali** (`docs/legal/`, template `page.legal` e `policy`), **Fase 5 — SEO** (dati strutturati, OG, mappa collezioni e redirect da approvare), **Fase 6 — performance e accessibilità** (font self-hosted, immagini responsive, GSAP solo dove serve, WCAG 2.2 AA), **Fase 7 — test e consegna** (E2E fino al pagamento di test, inventario cookie, audit after, checklist, PR).

## 8. Cosa serve per procedere

1. **Accesso al negozio**: dominio `*.myshopify.com` e una password dell'app Theme Access (o login della CLI) per lavorare su un tema non pubblicato. Senza, lavoro sul codice e verifico con il render locale; Lighthouse reale, E2E fino al checkout e inventario cookie/app restano da fare sul negozio.
2. **Branch**: confermi `feat/launch-ready` (finora ho lavorato su `claude/vigilant-noether-au314s`)?
3. **Dati** (andranno in `docs/DA-COMPILARE.md`): prezzi, taglie, composizione, grammatura, paese di produzione, fabbricante (GPSR), misure, dati aziendali (ragione sociale, P.IVA, sede, PEC), spedizioni (costi, tempi, soglia gratuita), chi paga il reso.
4. **Foto** del retro dei Baggy Jeans Vintage Blue.
5. **Origine del brand**: 22SIDE ha sede o origine a New York? (decide come riformulare il claim).
