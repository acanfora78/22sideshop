# 22SIDE — The Movement

**V3 direction:** *22SIDE is not just a streetwear brand — it's a movement.* The number **22** is the core identity (two equal strokes = the two tracks of Line 22 = the two sides). The site opens with a short film, then lets you walk through a physical store.

## The opening — THE MOVEMENT (`components/home/MovementIntro.tsx`)
SHOT 01 the city · 02 the arrival · 03 the key · 04 the lock (click) · 05 the door opens · 06 the store, lights on one by one · 07 the movement → *THIS IS NOT JUST STREETWEAR. THIS IS A MOVEMENT.* → **ENTER THE MOVEMENT**, exit through a giant growing 22.
- **Real AI video**: 7 clips (ElevenLabs · Kling 3 Pro, image-to-video) animated from original stills of a **fictional** character (gemini-3-pro-image). Each clip is trimmed to its best 1.3–2 s, graded and compressed (`scripts/assets/cut_clip.sh`): ~3.4 MB desktop / ~0.9 MB mobile in total, muted, `playsInline`. The stills are poster frames and the fallback; GSAP handles cuts, letterbox and the 22 exit. Preview: `docs/intro-the-movement-anteprima.mp4`.
- Skip any time · remembered for the **browsing session** (sessionStorage) · reduced-motion static card · original synthesized sound (`movementAudio.ts`), **off by default**, clear toggle.
- Variants kept: `INTRO_VARIANT` in `components/home/intro-config.ts` → `"movement"` (current), `"arrival"` (subway), `"door"` (kid with key, also in `archive/intro-porta-chiave`).
- Provenance of all generated images: `public/media/movement/README.md`.

## The 22 system (`components/twentytwo/TwentyTwo.tsx`)
`TwentyTwoMark` (self-drawing 22), `TwentyTwoReveal` (giant 22 mask that opens into the store on scroll), `TrackLines` (two tracks + travelling train dot between sections), `Pattern22` (drifting 22 pattern), `Count22` (counter landing on 22), plus the 22 marquee band in the hero and editorial numbering (22.01 …).

## The Store (`components/store/*`, `content/store.ts`)
Each collection hangs on its own AI-generated store wall (neon concrete, subway tiles, black brick, corrugated steel, raw concrete). Garments are the **clearly marked demo placeholders** rendered on metal hangers with a DEMO swing tag (`scripts/assets/gen_products.py`, `ONLY_HANGING=1`). Hover/focus/tap lights a garment, dims the rest and shows a product card (Italian); click opens the product. Touch: first tap selects, card button opens. Walls appear on the homepage, `/collections` and each collection page.

---

# Previous direction — 22 Side Street

**Concept:** *22 SIDE STREET — the place you were never supposed to find.* A fictional New York underground station on an imaginary **Line 22**: its signage, route maps, tickets and platforms are the brand's interface language. Plan & audit: `docs/REBUILD-PLAN.md`.

**Language:** English for identity (headlines, section titles, slogans, product names, signage, stickers). Italian for the experience (descriptions, details, cart, size guide, shipping, returns, support, buttons that buy, errors, microcopy). Brand slogans are never translated. Copy lives in `src/content/site.ts` and `src/data/*`.

**Demo prototype** of the 22SIDE digital flagship. Creative concept: *Underground NYC — 1990s reimagined.*
Raw, dark, cinematic; huge condensed type, film grain, B&W night imagery, Blood Red used only as a signal.

> ⚠️ All products, prices and stock levels are **placeholders**, not real 22SIDE merchandise. Checkout is intentionally disabled.

**Language:** the site is in Italian (`lang="it"`, prices `it-IT`). Brand lines stay in English by design: *No rules. Just attitude.*, *Not made to fit in.*, *You don't follow the side. You create it.*, *Enter the side*. All copy lives in `src/content/site.ts` and `src/data/*`.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Stack
Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · GSAP + ScrollTrigger · Lenis · Lucide.
Fonts (all SIL OFL via `next/font`): **Anton** (display), **Archivo** (text), **IBM Plex Mono** (labels/microtext), **Instrument Serif** (editorial italics), **Permanent Marker** (tags & stickers).

## Design system
| Token | Hex | Use |
|---|---|---|
| `obsidian` | `#080808` | page background |
| `asphalt` | `#171717` | surfaces, drawers |
| `concrete` | `#777777` | secondary text, labels |
| `dirty` | `#E8E5DF` | primary text, solid buttons |
| `blood` | `#8B1717` | accent only (index numbers, cut-bar in logo, key CTA) |

Utilities in `src/app/globals.css`: `font-display`, `label` (mono microtext), `text-mega/huge/big` (viewport-scaled display sizes), `text-outline-dirty`, `px-gutter`, `.grain` (animated film grain), `.halftone`, `.scanlines`.

## Structure
```
src/
  app/                    routes (home, shop, new-arrivals, collections, collections/[handle],
                          products/[handle], about, cart, search, not-found) + template.tsx (page transition)
  components/
    home/                 IntroSequence, Hero, BrandStatement, LatestDrop, UndergroundCulture,
                          ShopTheCollection, FinalStatement
    layout/               Header (+ NYC clock), MobileMenu, Footer, NewsletterForm, DemoBanner
    product/              ProductCard (hover swap + quick add), ProductGallery, ProductForm, ProductDetails
    collection/           PageHero, CollectionView (filter/sort), ProductGrid, CollectionPage
    cart/                 CartProvider (state + localStorage), CartDrawer, CartLineItem, CartSummary, CartPageView
    search/               SearchView
    motion/               SmoothScroll (Lenis⇄GSAP), Reveal/SplitText/ImageReveal, Parallax, Marquee, Magnetic
    ui/                   Logo, Button, SectionLabel/DemoTag
  content/                site.ts (all copy + nav), media.ts (image manifest)
  data/                   products.ts, collections.ts (DEMO data)
  lib/commerce/           types (Shopify-shaped), provider facade, mock provider, sort/search helpers
scripts/assets/           Python generators for every image in public/media
```

## Archivio
`archive/intro-porta-chiave/` — copia salvata dell'intro "porta e chiave" (storyboard, file e istruzioni di ripristino). Versione esatta: commit `4912e21`.

## 22 Side Street system
- `components/transit/Transit.tsx`: `LineBullet`, `StationSign`, `PlatformTag`, `Ticket`, `RouteStrip`.
- `components/transit/RouteMap.tsx`: Line 22 route map pinned to the homepage (desktop), one stop per section.
- Page transition: "Next stop — {station}" board (`app/template.tsx`, station names in `site.ts → stops`).

## Opening — THE ARRIVAL
Empty platform, fluorescent tubes stutter on, slow dolly, a headlight grows in the tunnel, the train tears past, cut to the 22 SIDE ST mosaic, the station sign drops, 22SIDE / *NO RULES. JUST ATTITUDE.* / *ENTER THE SIDE*, then the subway doors slide open onto the site (`components/home/ArrivalIntro.tsx`).
- Skip at any time (button / Esc), remembered 12h, reduced-motion static card.
- **Sound**: original, synthesized live with Web Audio (`stationAudio.ts`: hum, horn, rails, rumble, whoosh, door chime). Off by default, clear on/off toggle, nothing to download or license.
- The previous "door & key" intro is kept: set `INTRO_VARIANT = "door"` in `components/home/intro-config.ts` (also archived in `archive/intro-porta-chiave`).

## Motion
- **Intro (`DoorScene.tsx`)**: an animated SVG short directed by one GSAP timeline. The neon flickers on, a kid in a 22 hoodie walks up, smash zoom on the lock, the key goes in and turns (CLICK!), the door bursts open (SWOOSH!), light floods out, they step in and the camera dives through the door. Then a glitched logo slam with draggable stickers and *ENTER THE SIDE*. Skippable immediately (button / Esc). Remembered for 12h; footer has **Replay intro ↻**.
- Youth layer: Permanent Marker font (`font-marker`), draggable `Sticker`s, self-drawing `Scribble`s, "cop it!" hover tags on product cards.
- Lenis smooth scroll driven by the GSAP ticker (off on touch devices and for reduced motion).
- Scroll-scrubbed hero split, word-by-word "light up" manifesto, pinned horizontal contact-sheet on desktop, parallax images, clip-path image reveals, masked text reveals, marquees, magnetic CTAs, cursor-following collection preview, curtain page transitions.
- `prefers-reduced-motion`: intro cuts, parallax, scrub effects, grain and marquees are disabled.

## Images — how to replace
Every editorial image is an **original, procedurally generated art-direction frame** (`scripts/assets/gen_scenes.py`), so the demo contains no unlicensed photography, third-party logos or artist likenesses. Product images are flat-lay **placeholders** stamped "DEMO PRODUCT — PLACEHOLDER IMAGE" (`gen_products.py`).

To use real assets:
1. Editorial: drop files into `public/media/` and update `src/content/media.ts` (url, width, height, alt).
2. Products: `public/media/products/{handle}-{front|back|detail}.jpg`, or simply let Shopify supply images.

Regenerate placeholders: `python3 scripts/assets/gen_scenes.py && python3 scripts/assets/gen_products.py` (needs Pillow + numpy).

## Shopify migration map
Data, content and presentation are separated so the move to a custom Shopify theme (or a Storefront API headless build) is mechanical.

| Prototype | Shopify |
|---|---|
| `lib/commerce/types.ts` (`Product`, `ProductVariant`, `Collection`, `Money`, `CartLine`) | `product`, `variant`, `collection`, `money`, `cart.items` objects |
| `lib/commerce/index.ts` facade | swap `mockProvider` for a Storefront API provider, or replace with Liquid objects |
| `CartProvider` (add/update/remove, subtotal) | `/cart/add.js`, `/cart/change.js`, `cart.total_price` — or `cartLinesAdd` mutations |
| Disabled checkout button | `/checkout` (Shopify Checkout) |
| `app/page.tsx` section order | `templates/index.json` |
| `components/home/*` | `sections/22side-intro.liquid`, `hero`, `statement`, `latest-drop`, `culture`, `shop-collections`, `final-statement` |
| `content/site.ts` / `content/media.ts` | section `settings` + `blocks`, `image_picker` settings |
| `products/[handle]`, `collections/[handle]` | `templates/product.json`, `templates/collection.json` |
| `mainNav` | `linklists.main-menu` |
| `product.details` | product metafields |
| URL scheme `/products/{handle}`, `/collections/{handle}`, `/search?q=` | identical to Shopify |

## Quality checks performed
Type-check, ESLint and production build clean · Playwright pass on desktop (1440) and iPhone 13: intro skip/remember, add to cart with size validation, quantity limits by stock, quick add, drawer, cart persistence across reload, quantity update, remove, clear, empty states, search, all routes, 404 · no console errors · no horizontal overflow on mobile.
