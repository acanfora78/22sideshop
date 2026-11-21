# Checklist admin Shopify

Cresce fase per fase. Qui ci sono i passaggi **già richiesti dal tema**.

## 1. Collezioni del catalogo (4 linee)

Prodotti → Collezioni → **Crea collezione**, tipo **Automatica**, condizione "Tag prodotto è uguale a":

| Titolo (esatto) | Handle risultante | Tag | Prodotti |
|---|---|---|---|
| T-shirt | `t-shirt` | `linea-t-shirt` | Cash Mouth Layered, Heaven, Rise With Faith, Cash Grill, Eternity |
| Longsleeve | `longsleeve` | `linea-longsleeve` | Chase Light, Cash Lips |
| Coordinati | `coordinati` | `linea-coordinati` | Cargo Set, Faded Tracksuit |
| Pantaloni | `pantaloni` | `linea-pantaloni` | Baggy Jeans ×2, Wide Sweatpants |

I tag arrivano già dal CSV `exports/22side-prodotti-shopify.csv`. L'handle deve essere esattamente quello in
tabella (lo trovi in fondo alla collezione, "Anteprima dei risultati dei motori di ricerca"): il tema legge le linee
da *Personalizza tema → Impostazioni del tema → Catalogo*, dove puoi cambiarne ordine o handle.

## 2. Menu principale

Il menu "Catalogo" funziona anche senza fare nulla (legge le 4 linee dall'impostazione del tema).
Se vuoi gestirlo da Negozio online → **Navigazione → Menu principale**: crea la voce "Catalogo" (link: Prodotti →
Tutti i prodotti) e trascina sotto di essa T-shirt, Longsleeve, Coordinati, Pantaloni. Le voci con sotto-voci
diventano automaticamente la tendina.

## 3. Prodotti

1. Impostazioni → Dati personalizzati → Prodotti: crea `custom.codice` (testo a riga singola) **prima** dell'import.
2. Prodotti → Importa → `exports/22side-prodotti-shopify.csv` (spunta "Sovrascrivi i prodotti con lo stesso handle").
3. Quando inserisci le taglie: togli il tag `taglie-da-confermare`.

## 4. Testi legali

Sono già nel tema (`/?view=privacy`, `/?view=recesso`…, link nel footer): non serve creare pagine.

1. Impostazioni › **Privacy dei clienti** › Banner sui cookie: attivo per UE/SEE, con "Accetta" e "Rifiuta".
2. Impostazioni › **Notifiche** › Marketing: attiva la doppia conferma per la newsletter.
3. Personalizza tema › modello **Home page — garanzia** › sezione "Avviso garanzia UE": carica l'immagine ufficiale italiana dell'avviso armonizzato (allegato del Reg. di esecuzione (UE) 2025/1960).
4. **Recessi**: rispondi a ogni richiesta con la conferma di ricezione (contenuto in `docs/legal/README.md`).
5. Facoltativo: incolla i testi anche in Impostazioni › Policy, per avere i link nel checkout.
