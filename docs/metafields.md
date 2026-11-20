# Metafield e metaobject da creare in admin

Impostazioni › Dati personalizzati. Questo file cresce fase per fase: qui ci sono le definizioni **già lette dal tema**.

## Prodotto (`custom`)

| Nome | Namespace.chiave | Tipo | Usato in |
|---|---|---|---|
| Codice | `custom.codice` | Testo a riga singola (es. `22-03`) | card prodotto, scheda prodotto. Importato dal CSV (colonna `Codice (product.metafields.custom.codice)`) |
| Didascalie immagini | `custom.immagini_didascalie` | Lista di testi a riga singola | "Fig. 0N — …" nella galleria. Una voce per media, **nello stesso ordine dei media** (es. Fronte, Outfit, Retro). Se manca, si vede solo "Fig. 0N" |

Didascalie da inserire (ordine attuale dei media):

| Prodotto | Didascalie |
|---|---|
| Heaven Tee | Fronte, Outfit |
| Cash Grill Tee | Fronte, Outfit |
| Eternity Tee | Fronte, Outfit, Retro |
| Baggy Jeans — Washed Black | Fronte, Outfit |
| Wide Sweatpants | Fronte, Outfit |
| Baggy Jeans — Vintage Blue | Fronte |
| Cargo Set | Completo, Giacca, Pantalone, Retro |
| Faded Tracksuit | Completo, Felpa, Pantalone |
| Tutti gli altri | Fronte |

## Metaobject `linea`

Una voce per ogni linea mostrata in "Pick your line". Se non esiste nessuna voce, la sezione usa i blocchi
dell'editor o, in mancanza, tutte le collezioni con prodotti.

| Campo | Chiave | Tipo |
|---|---|---|
| Numero | `numero` | Testo a riga singola (`01`, `02`…) — definisce anche l'ordine |
| Nome | `nome` | Testo a riga singola (es. "Tops") |
| Sottotitolo | `sottotitolo` | Testo a riga singola (es. "Tees e longsleeve") |
| Collezione | `collezione` | Riferimento a collezione |

Accesso storefront: attiva "Accesso Storefront" sulla definizione, altrimenti Liquid non la legge.
