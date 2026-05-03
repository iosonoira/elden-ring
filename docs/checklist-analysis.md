# Analisi Caveman: Elden-Ring-Automatic-CheckList

Me Senior Dev. Me guardato dentro cartella `Elden-Ring-Automatic-CheckList`.
Eco cosa fa progetto e cosa noi prende. Noi non tocca file originali, noi prende solo logica.

## Cosa fa progetto?
- Tool web (HTML, JS puro, jQuery) per completismo 100% Elden Ring.
- Utente carica file di salvataggio `.sl2`.
- App legge ArrayBuffer (`BND4` check).
- Trova 10 slot personaggio, legge nomi.
- Utente sceglie slot -> app cerca pattern esadecimale inventario.
- Estrae ID di ogni oggetto, inverte endianness.
- Confronta ID estratti con database JSON enormi (armi, armature, talismani, magie).
- Sputa fuori UI divisa tra "Posseduti" e "Mancanti".

## Cosa noi recupera (Paradigma Lettura Salvataggio)
Noi usa stessa identica logica, ma porta in Vue/Nuxt per UI bella. Noi serve:

1.  **Offset e Indirizzi Memoria:**
    - Divisione in 10 slot fissi (es. `0x00000310` - `0x0028030f` per Slot 1).
    - Posizione dei nomi dei personaggi (es. `0x1901d0e` per Slot 1).

2.  **Pattern di Ricerca Byte (Vanilla & DLC):**
    - Pattern Vanilla: `[0xB0, 0xAD, 0x01, 0x00, 0x01, 0xFF, 0xFF, 0xFF]`
    - Pattern DLC: `[0xB0, 0xAD, 0x01, 0x00, 0x01]`
    - Funzioni `subfinder` e `buffer_equal` per scansionare l'array di byte.

3.  **Estrattori Dati Core:**
    - Funzione `getInventory(slot)` per prendere il chunk giusto.
    - Funzione `getIdReversed(id)`: serve per invertire stringhe hex per matchare database.
    - Funzione `split(list, chunk_size)`: inventory chunk size è 8 per DLC, 16 per Vanilla.

4.  **Database JSON:**
    - `assets/json/all_items.json`
    - `dlc_items.json`, `unobtainable.json`, ecc.
    - Servono tutti per mappare Hex ID -> Nome Oggetto Vera.

## Come noi procede?
Noi prende questa "tecnologia del fuoco" da `script.js` e la butta nel nostro store Nuxt.
No jQuery, no DOM manipulation qui. Solo funzioni pure che prendono file, sputano JSON strutturato con posseduti/mancanti, e poi nostra UI fa resto.

## Integrazione con Elden Ring Fan API
Noi usa API pubblica (`https://docs.eldenring.fanapis.com/docs`) per arricchire i dati grezzi.

- **Il ponte (La Chiave di Unione):** La logica del salvataggio ci dà un array di **nomi** (es: `["Uchigatana"]`).
- **La Ricerca API:** Usiamo questo nome per interrogare l'API tramite endpoint REST (es: `/api/weapons?name=Uchigatana`) o tramite GraphQL per fare query multiple ed efficienti.
- **Dati Arricchiti:** Invece di usare le immagini sgranate locali del vecchio progetto, l'API ci restituisce:
  - `image` (immagini ad alta risoluzione)
  - `description` (lore dell'oggetto)
  - `location` (dove trovarlo)
  - Statistiche e requisiti
- **Vantaggio Nuxt/Vue:** Con `$fetch` o `useAsyncData`, carichiamo in modo asincrono questi dati ricchi nei nostri componenti *Gilded Reliquary*. Questo permette soprattutto di dire all'utente *dove* andare a recuperare l'oggetto mancante, feature cruciale che mancava del tutto nel progetto originale. Ugh.
