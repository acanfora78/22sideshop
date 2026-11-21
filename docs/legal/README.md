# Testi legali 22SIDE — novembre 2026

> **BOZZE — da validare con avvocato/commercialista prima della pubblicazione.** Non sono consulenza legale.
> I campi `[[…]]` vanno compilati con i dati reali del venditore (elenco in `docs/DA-COMPILARE.md`).

## Dove va ogni testo

| File | Dove in Shopify | Modello del tema |
|---|---|---|
| `01-condizioni-di-vendita.md` | Impostazioni › Policy › **Termini di servizio** | (policy) |
| `02-recesso-e-resi.md` | Impostazioni › Policy › **Politica di rimborso** | (policy) |
| `03-spedizioni.md` | Impostazioni › Policy › **Politica di spedizione** | (policy) |
| `04-privacy.md` | Impostazioni › Policy › **Informativa sulla privacy** | (policy) |
| `06-informazioni-venditore.md` | Impostazioni › Policy › **Informazioni di contatto** | (policy) |
| `05-cookie.md` | Negozio online › Pagine › "Cookie policy", handle `cookie` | `page.legal` |
| `07-garanzia-legale.md` | Pagine › "Garanzia legale", handle `garanzia` | `page.garanzia` |
| `08-accessibilita.md` | Pagine › "Accessibilità", handle `accessibilita` | `page.legal` |
| `09-pagina-recesso.md` | Pagine › "Recedi dal contratto qui", handle `recesso` | `page.recesso` |

**Come incollarli:** apri `docs/legal/html/anteprima.html` nel browser, seleziona il testo di un documento e incollalo nell'editor di Shopify: titoli, elenchi e tabelle restano formattati. In alternativa, nell'editor delle Pagine usa il pulsante `<>` (Mostra HTML) e incolla il file `.html` corrispondente. Rigenera gli HTML dopo ogni modifica: `bash scripts/legal/build.sh`.

Le policy native vengono linkate automaticamente nel footer del tema e del checkout. Le pagine `cookie`, `garanzia`, `accessibilita` e `recesso` compaiono nel footer appena le crei (il tema le cerca per handle).

## Cosa c'è di nuovo rispetto ai testi standard di Shopify

| Novità | Norma | Applicabile da | Dove |
|---|---|---|---|
| **Funzione di recesso digitale** ("Recedi dal contratto qui" → "Conferma recesso" → conferma su supporto durevole) | Art. 54-bis Codice del Consumo, introdotto dal D.Lgs. 31/12/2025 n. 209 (recepimento Dir. (UE) 2023/2673); modifica dell'art. 49 sulle informazioni precontrattuali | Contratti conclusi dal **19/06/2026** | Sezione tema `withdrawal-function`, pagina `recesso`, link fisso nel footer, testi 01, 02, 09 |
| **Avviso armonizzato UE sulla garanzia legale** | Dir. (UE) 2024/825 (art. 22-bis Dir. 2011/83/UE); Reg. di esecuzione (UE) 2025/1960 | **27/09/2026** | Sezione tema `guarantee-notice` nella pagina `garanzia` (immagine ufficiale da caricare) |
| **Niente link alla piattaforma ODR** | Reg. (UE) 2024/3228 ha abrogato il Reg. 524/2013 | 20/07/2025 | Nessun riferimento ODR nei testi: rimuovilo se Shopify lo aggiunge |
| Prezzo più basso degli ultimi 30 giorni negli sconti | Art. 17-bis Codice del Consumo (D.Lgs. 26/2023) | 2023 | Testo 01 §4; il tema mostra lo sconto solo con il metafield `custom.prezzo_minimo_30gg` (fase scheda prodotto) |
| Garanzia legale 2 anni, presunzione 1 anno | Artt. 128 ss. Codice del Consumo (D.Lgs. 170/2021) | 2022 | Testo 07 |
| Composizione fibrosa prima dell'acquisto; dati del fabbricante | Reg. (UE) 1007/2011 art. 16; Reg. (UE) 2023/988 (GPSR) art. 19 | 2011 / 13/12/2024 | Testo 01 §3; schede prodotto (fase 2) |
| Cookie: "Accetta" e "Rifiuta" di pari evidenza, link "Preferenze cookie" sempre visibile | Art. 122 Codice privacy; Linee guida Garante 10/06/2021 | 2022 | Testo 05; pulsante nel footer |
| Newsletter con consenso esplicito non preselezionato | GDPR art. 7; art. 130 Codice privacy | — | Footer del tema |

## Fonti consultate (novembre 2026)

Verificare comunque il testo vigente su [Normattiva](https://www.normattiva.it) e [EUR-Lex](https://eur-lex.europa.eu) prima della pubblicazione: alcune fonti sotto sono commenti di studi legali, non testi ufficiali.

- Art. 54-bis e D.Lgs. 209/2025: [Studio Previti](https://www.previti.it/recesso-online-il-nuovo-articolo-54-bis-del-codice-del-consumo-e-lintroduzione-del-pulsante-digitale-di-recesso), [Pallavicini Legal](https://www.pallavicinilegal.com/blog/contratti-online-e-diritto-di-recesso-un-nuovo-pulsante-digitale-nel-codice-del-consumo/), [Standards Legal](https://standardslegal.it/il-pulsante-di-recesso-obbligatorio-per-gli-e-commerce-cosa-cambia-dal-19-giugno-2026/)
- Avviso armonizzato garanzia: [Cuatrecasas](https://www.cuatrecasas.com/en/global/retail-1/art/harmonized-notice-label-new-eu-rules-2026), [Lexology](https://www.lexology.com/library/detail.aspx?g=554a0fa8-85e9-417b-9977-92e178610522)
- Riapertura del banner cookie Shopify (`privacyBanner.showPreferences()`, metodo non documentato ufficialmente): [Shopify Community](https://community.shopify.com/t/method-to-manually-trigger-the-cookie-consent-banner/299099), [Shopify — cookie banner](https://shopify.dev/docs/themes/trust-security/cookie-banner)

## Punti da far validare

1. Testo esatto delle etichette della funzione di recesso richiesto dall'art. 54-bis ("Recedi dal contratto qui" / "Conferma recesso" o formule equivalenti) e contenuto minimo della conferma di ricezione.
2. Stato del recepimento italiano della Dir. 2024/825 e modalità di esposizione dell'avviso armonizzato (solo pagina dedicata o anche scheda prodotto).
3. Chi paga i resi; recesso parziale dei coordinati.
4. Adesione a un organismo ADR.
5. Elenco reale di app, pixel e cookie (da rilevare sul negozio senza password).
6. Applicabilità degli obblighi EAA (microimpresa o no).
