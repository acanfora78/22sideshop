# Testi legali 22SIDE — novembre 2026

Testi per un'attività di **vendita occasionale**. Ai consumatori sono riconosciuti comunque recesso di 14 giorni e garanzia legale di 2 anni, come nel Codice del Consumo.

## Dove sono

I testi sono **già nel tema**: i file `.md` di questa cartella generano gli snippet `shopify-theme/snippets/legal-*.liquid`
(`bash scripts/legal/build.sh`), mostrati dalla sezione "Documento legale" su queste pagine:

| Documento | Indirizzo |
|---|---|
| Condizioni di vendita | `/?view=condizioni` |
| Recedi dal contratto qui + Recesso e resi + modulo tipo | `/?view=recesso` |
| Spedizioni | `/?view=spedizioni` |
| Informativa sulla privacy | `/?view=privacy` |
| Cookie policy | `/?view=cookie` |
| Garanzia legale (+ avviso armonizzato UE) | `/?view=garanzia` |
| Informazioni di contatto | `/?view=venditore` |
| Accessibilità | `/?view=accessibilita` |

Il footer di ogni pagina li collega tutti. Non serve creare pagine in Shopify.

Facoltativo: i link alle policy nel **checkout** di Shopify compaiono solo se incolli i testi anche in
Impostazioni › Policy (copia pronta in `html/anteprima.html`).

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
