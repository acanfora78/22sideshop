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

## Negozio (`brand`) — dati del venditore nel footer

Impostazioni › Metafield e metaoggetti › **Negozio** (o "Shop"). Tutti testo a riga singola. Il footer li mostra
in fondo a ogni pagina (D.Lgs. 70/2003 art. 7, DPR 633/1972 art. 35, c.c. art. 2250). Se mancano, i clienti non vedono
nulla e tu vedi un avviso solo nell'editor del tema.

| Nome | Chiave | Esempio |
|---|---|---|
| Ragione sociale | `brand.ragione_sociale` | 22SIDE di Mario Rossi |
| Forma giuridica | `brand.forma_giuridica` | ditta individuale / S.r.l. |
| Sede legale | `brand.sede_legale` | Via …, 84018 Scafati (SA) |
| Partita IVA | `brand.partita_iva` | 01234567890 |
| Codice fiscale | `brand.codice_fiscale` | |
| REA | `brand.rea` | REA SA-123456 |
| Capitale sociale (solo società di capitali) | `brand.capitale_sociale` | € 10.000 i.v. |
| PEC | `brand.pec` | |
| Email assistenza | `brand.email_assistenza` | |

## Pagina (`custom`)

| Nome | Chiave | Tipo | Uso |
|---|---|---|---|
| Aggiornato il | `custom.aggiornato_il` | Data | "Ultimo aggiornamento" nelle pagine legali. Se manca, il tema usa la data impostata nella sezione (21/11/2026) |
