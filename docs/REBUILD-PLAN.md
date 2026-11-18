# 22 SIDE STREET — audit & rebuild plan

## Audit of the current build
**Keep (works well):**
- Commerce layer, Shopify-shaped (`lib/commerce`), cart with persistence, quick add, search, filters.
- Motion foundations: Lenis⇄GSAP, SplitText / ImageReveal / Parallax / Marquee / Magnetic.
- Manifesto scroll "light-up", asymmetric drop lookbook, collection index with cursor preview.
- Youth layer (stickers, marker font, scribbles) — scaled back to accents only.
- Door-and-key intro: archived in `archive/intro-porta-chiave` and still selectable (`intro-config.ts`).

**Weaknesses:**
1. No unifying world: the subway/NYC references were imagery only, not an interface system.
2. Language: several headlines were Italian, some functional copy too loose ("borsa").
3. The opening didn't match the new "arrival at the station" concept; no sound.
4. Hero headline repeated the intro slogan; no monumental wordmark moment.
5. Underground section was a contact-sheet strip — a gallery, not a story.
6. Product page had no size guide; buying copy not conversion-oriented.
7. Page transitions were generic.

## Plan
1. **Language strategy**: English for identity (headlines, section titles, slogans, product names, stickers); Italian for the experience (descriptions, details, cart, size guide, shipping, errors, buttons, microcopy). Every string lives in `content/site.ts` and `data/*`.
2. **Transit design system** (`components/transit/*`): `LineBullet`, `StationSign`, `RouteMap` (home progress line + footer map), `Ticket`, `PlatformTag`. Used on every page.
3. **Opening "The Arrival"**: empty platform, fluorescent tubes flicker on, the camera pushes in, headlight grows, the train rushes past, the 22 SIDE STREET sign is revealed, logo + *NO RULES. JUST ATTITUDE.* + *ENTER THE SIDE*; exit = subway doors opening onto the site. Skip, Esc, reduced motion, 12h memory.
4. **Sound**: original, synthesized live with Web Audio (rumble, fluorescent hum, rail clacks, horn). Off by default, clear mute/unmute.
5. **Hero "THE STREET IS OURS"**: monumental 22SIDE wordmark, campaign image, station caption, SHOP THE DROP.
6. **The Underground**: five chapters with distinct compositions — THE BLOCK, THE TRAIN, THE ROOFTOPS, THE SOUND (spinning vinyl), THE CULTURE.
7. **Product page**: size guide dialog, "Seleziona la taglia / Aggiungi al carrello / Disponibilità limitata", shipping copy.
8. **Transitions**: "Next stop — {page}" station curtain.
9. **QA**: every route, desktop + mobile, cart flow, console, overflow, reduced motion.
