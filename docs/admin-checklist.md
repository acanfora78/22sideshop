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

## 4. Testi legali (vedi `docs/legal/README.md`)

1. Impostazioni › **Policy**: incolla Termini di servizio, Politica di rimborso, Politica di spedizione, Informativa sulla privacy, Informazioni di contatto (sostituendo i testi di Shopify).
2. Negozio online › **Pagine** › Aggiungi pagina, scegliendo il **modello** a destra:
   - "Cookie policy" — handle `cookie` — modello `legal`
   - "Garanzia legale" — handle `garanzia` — modello `garanzia`
   - "Accessibilità" — handle `accessibilita` — modello `legal`
   - "Recedi dal contratto qui" — handle `recesso` — modello `recesso`
   - "Contatti" esiste già: controlla che usi il modello `contact`.
3. Pagina **Garanzia legale** › Personalizza › sezione "Avviso garanzia UE": carica l'immagine ufficiale italiana dell'avviso armonizzato (allegato del Reg. di esecuzione (UE) 2025/1960).
4. Impostazioni › **Privacy dei clienti** › Banner sui cookie: attivo per UE/SEE, con "Accetta" e "Rifiuta".
5. Impostazioni › **Notifiche** › Marketing: attiva la doppia conferma per la newsletter.
6. **Recessi**: rispondi a ogni richiesta con la conferma di ricezione (contenuto in `docs/legal/README.md`).
