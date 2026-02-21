# BoardScore — Segnapunti Universale (Offline)

Webapp **standalone** per segnare punteggi di **qualsiasi gioco da tavolo**.
Funziona **senza backend**, salva i dati nel browser tramite **localStorage** e supporta **export/import JSON**.

## Avvio

1. Metti `index.html`, `styles.css`, `app.js` nella stessa cartella.
2. Apri `index.html` nel browser (Chrome/Firefox/Edge).
   - Suggerito: usare un server locale (es. estensione “Live Server”) ma non è obbligatorio.

## Concetti base

- **Partita**: un contenitore con nome, impostazioni, giocatori, round e punteggi.
- **Giocatori**: lista dinamica (puoi rinominare o rimuovere).
- **Round**: righe di punteggio ripetute; ogni round contiene uno score per giocatore.
- **Totale**: calcolato automaticamente.
- **Classifica**: ordinata in base a “vince alto” o “vince basso”.

## Creare una partita

1. Clicca **+ Nuova**.
2. Inserisci un nome (es. “Carcassonne — Serata del venerdì”).
3. (Opzionale) Seleziona un **preset**: imposta modalità e numero round.
4. Clicca **Crea**.

## Configurare la partita

Nella schermata della partita puoi impostare:

- **Nome gioco / partita**: rinomina in qualsiasi momento.
- **Modalità punteggio**:
  - **Somma per round**: più round, il totale è la somma.
  - **Punteggio singolo**: un solo valore per giocatore (senza round multipli).
- **Vince**:
  - **Punteggio più alto**
  - **Punteggio più basso** (utile per “golf score” tipo Skyjo)
- **Note**: varianti, espansioni, regole casalinghe.

## Gestire i giocatori

- Scrivi un nome e premi **Aggiungi**.
- Per rinominare: clicca sul chip → **✏️**.
- Per rimuovere: clicca sul chip → **✕** (rimuove anche i punteggi).

Suggerimento: aggiungi almeno 2 giocatori per una classifica sensata.

## Inserire punteggi

- In modalità **Somma per round**:
  - premi **+ Round** per aggiungere round.
  - inserisci i valori nelle celle (accetta anche valori negativi).
- In modalità **Punteggio singolo**:
  - c’è un solo “round” (una sola colonna score).

Il **totale** e la **classifica** si aggiornano automaticamente.

## Concludere / riaprire una partita

- Premi **Concludi** per impostare la partita come terminata.
- Premi **Riapri** per tornarla attiva.
- Il filtro nella sidebar permette di vedere **Attive / Concluse / Tutte**.

## Esportare e importare dati

- **Esporta**: scarica un file JSON con tutte le partite.
- **Importa**: carica un JSON esportato in precedenza (sovrascrive i dati locali).

Uso consigliato:
- esporta periodicamente per backup;
- importa su un altro dispositivo per trasferire le partite.

## Reset

- **Reset** cancella tutti i dati salvati nel browser (irreversibile).

## Preset (modelli) e “tutti i giochi”

Questa app include **preset generici** (somma round / punteggio singolo / vince alto o basso).
Non include un database completo di “tutti i giochi fino al 2026” perché richiederebbe una sorgente esterna, licenze e aggiornamenti.

Strategia pratica:
- usa i preset generici per la maggior parte dei giochi;
- crea preset specifici (in codice o aggiungendo una tua libreria JSON) se vuoi replicare schede punteggio particolari.

## Privacy

- I dati restano nel tuo browser (localStorage).
- Nessuna rete, nessun tracking, nessun account.
