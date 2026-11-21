# Testi legali 22SIDE — novembre 2026

Testi per un'attività di **vendita occasionale**. Ai consumatori sono riconosciuti comunque recesso di 14 giorni e garanzia legale di 2 anni, come nel Codice del Consumo.

## Dove va ogni testo

| File | Dove in Shopify | Modello del tema |
|---|---|---|
| `01-condizioni-di-vendita.md` | Impostazioni › Policy › **Termini di servizio** | — |
| `02-recesso-e-resi.md` | Impostazioni › Policy › **Politica di rimborso** | — |
| `03-spedizioni.md` | Impostazioni › Policy › **Politica di spedizione** | — |
| `04-privacy.md` | Impostazioni › Policy › **Informativa sulla privacy** | — |
| `06-informazioni-venditore.md` | Impostazioni › Policy › **Informazioni di contatto** | — |
| `05-cookie.md` | Pagine › "Cookie policy", handle `cookie` | `legal` |
| `07-garanzia-legale.md` | Pagine › "Garanzia legale", handle `garanzia` | `garanzia` |
| `08-accessibilita.md` | Pagine › "Accessibilità", handle `accessibilita` | `legal` |
| `09-pagina-recesso.md` | Pagine › "Recedi dal contratto qui", handle `recesso` | `recesso` |
| — | Pagine › "Contatti", handle `contact` (già presente) | `contact` |

**Come incollarli:** apri `html/anteprima.html` nel browser, seleziona il testo di un documento e incollalo nell'editor di Shopify. Dopo ogni modifica dei file `.md`: `bash scripts/legal/build.sh`.

## Norme di riferimento

| Tema | Norma |
|---|---|
| Funzione di recesso online ("Recedi dal contratto qui" → "Conferma recesso" → conferma via email) | Art. 54-bis Codice del Consumo (D.Lgs. 209/2025), dal 19/06/2026 |
| Avviso armonizzato UE sulla garanzia legale | Dir. (UE) 2024/825, Reg. di esecuzione (UE) 2025/1960, dal 27/09/2026 |
| Nessun link alla piattaforma ODR | Reg. (UE) 2024/3228 (abrogazione dal 20/07/2025) |
| Recesso 14 giorni, rimborso, modulo tipo | Codice del Consumo artt. 52–59, Allegato I |
| Garanzia legale 2 anni | Codice del Consumo artt. 128 ss. |
| Prezzo più basso degli ultimi 30 giorni negli sconti | Codice del Consumo art. 17-bis |
| Privacy | Reg. (UE) 2016/679; D.Lgs. 196/2003 |
| Cookie: "Accetta" e "Rifiuta" di pari evidenza, preferenze sempre modificabili | Art. 122 D.Lgs. 196/2003; Linee guida Garante 10/06/2021 |

## Conferma di ricezione del recesso

Ogni richiesta inviata dalla pagina "Recedi dal contratto qui" arriva all'email del negozio come messaggio del modulo contatti, con "Tipo di richiesta: RECESSO". Rispondi subito al cliente con una email che contenga:

1. la conferma che hai ricevuto il recesso;
2. il contenuto della richiesta (numero d'ordine e articoli);
3. la data e l'ora di invio (campo "Inviato il" del messaggio);
4. come e dove rispedire i prodotti;
5. che il rimborso arriverà entro 14 giorni con lo stesso metodo di pagamento.
