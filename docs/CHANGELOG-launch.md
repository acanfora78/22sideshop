# Changelog — lancio 22SIDE

## Fase 0 — Analisi
Report in `docs/audit/fase-0/README.md`.

## Fase 1 — Correzioni rapide

| # | Correzione | Dettaglio |
|---|---|---|
| 1 | Immagine sbagliata | Baggy Jeans Vintage Blue: tolta la foto condivisa con la Eternity Tee (nessuna foto del retro disponibile). CSV rigenerato |
| 2 | Didascalie Fig. | Tema: lette da `custom.immagini_didascalie` (una per media), mai dalla posizione. Sito Next: campo `caption` esplicito per ogni immagine (Heaven Tee Fig. 02 ora è "Outfit") |
| 3 | Numerazione e conteggi | Numeri tolti dai menu (si scontravano con quelli delle sezioni); sezioni della home 01–05 (+ "22"); "Pick your line" legge il metaobject `linea`, conteggi da `collection.products_count`; esclusa `frontpage` come nella pagina Collezioni |
| 4 | Nomi accessibili | Logo con `role="img"`; alt delle immagini prodotto con fallback al titolo; codice 22-XX dal metafield `custom.codice` su card e scheda |
| 5 | H1 home | Verificato: nome accessibile "The movement." |
| 6 | Controlli | Ordinamento e filtro "Solo disponibili" visibili solo se la collezione ha prodotti acquistabili; stato vuoto nel tono del brand con CTA; testi in `locales/it.default.json` |
| + | Dall'audit | Contrasto: nuovo rosso `signal` #e5484d per i testi (i rossi del brand restano per superfici e pulsanti), grigio `concrete` #777 → #8c8c8c, parole "light-up" del manifesto al 45%. Card prodotto impilate sotto 640 px (prezzo non più sovrapposto). Overflow a 375/768 px risolto (capitolo "The Rooftops") |
| + | Claim di origine | "nato a Scafati e cresciuto con la cultura underground di New York"; coordinate dell'hero ora di Scafati. Elenco in `docs/copy/claim.md` |

Verifica dopo la fase (render locale): axe 0 violazioni su catalogo, schede, carrello e intro; in home restavano 13 nodi delle parole "light-up" (corretti portando l'opacità al 45%). Nessun overflow orizzontale a 375–1920 px. `theme check`: 0 errori, solo i 6 avvisi già noti sui Google Fonts.

Ancora aperti (fasi successive): target touch < 44 px, intro (localStorage, "Salta" per primo, scroll libero), testi rimasti scritti nei file Liquid, numerazione del menu nel sito Next.

## Testi legali e funzioni obbligatorie (novembre 2026)

- `docs/legal/`: condizioni di vendita, recesso e resi (con modulo tipo e modello di conferma), spedizioni, privacy, cookie, informazioni venditore, garanzia legale, accessibilità, pagina recesso. Versioni HTML pronte da incollare in `docs/legal/html/` (`bash scripts/legal/build.sh`).
- Tema: funzione di recesso digitale (art. 54-bis Codice del Consumo, dal 19/06/2026) con link fisso "Recedi dal contratto qui" nel footer; sezione per l'avviso armonizzato UE sulla garanzia legale (Reg. 2025/1960, dal 27/09/2026); modello `page.legal` con indice cliccabile e data di aggiornamento; stile delle policy native.
- Footer: colonna "Legale" (policy + pagine legali), "Preferenze cookie", dati del venditore dai metafield `brand.*`, icone dei pagamenti; newsletter con consenso non preselezionato e link alla privacy.
