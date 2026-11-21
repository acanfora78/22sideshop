# Claim di origine — frasi modificate (da approvare)

22SIDE nasce a Scafati (SA); su richiesta del brand il sito dice "nato all’ombra del Vesuvio". Le frasi che facevano pensare a un brand nato o con sede a New York sono state
riformulate per non indurre in errore sull'origine del prodotto (Codice del Consumo, artt. 21–22).
New York resta come **ispirazione** dichiarata e come ambientazione narrativa.

| Dove | Prima | Dopo |
|---|---|---|
| Hero (tema `sections/hero.liquid` e sito `src/content/movement.ts`) | "indipendente, cresciuto nell'underground di New York, tenuto insieme da un numero." | "indipendente, nato all’ombra del Vesuvio e cresciuto con la cultura underground americana, tenuto insieme da un numero." |
| Hero, didascalia coordinate | "40.6782° N — 73.9442° W" (Brooklyn: sembrava un recapito) | "40.7536° N — 14.5286° E" (le coordinate reali di Scafati; impostazione modificabile) |
| Meta description del sito (`src/app/layout.tsx`) | "streetwear indipendente nato dall'underground di New York…" | "streetwear indipendente nato all'ombra del Vesuvio e cresciuto con la cultura underground americana…" |
| Chi siamo, introduzione (`src/content/site.ts`) | "un punto di vista nato dalla cultura di strada americana, dall'underground di New York…" | "un punto di vista nato all'ombra del Vesuvio e cresciuto con la cultura underground americana…" |
| Chi siamo, "Raised on the culture" | "Siamo cresciuti guardando gli anni '90…" (dopo i gradini di Brooklyn) | "…li abbiamo conosciuti da lontano, all'ombra del Vesuvio, guardando gli anni '90…" |

## Lasciate invariate (narrative, non affermano un'origine)

- "Line 22", "22 Side St.", "Platform 2", biglietto "No. 002222": elementi grafici di una linea immaginaria, mai usati come recapito. I recapiti reali andranno nel footer dai metafield `brand.*`.
- Orologio "NYC" nell'header: dettaglio editoriale.
- Film dell'intro (non attivo): "New York, 2:22 di notte" è la scena di un racconto.
- Underground Culture: "Il blocco", "The Train", "The Rooftops": ambientazioni, non luoghi di produzione.

Da confermare: il **paese di produzione** dei capi (metafield `custom.paese_produzione`). Se non è l'Italia, evitare
qualsiasi "Made in Italy" implicito.
