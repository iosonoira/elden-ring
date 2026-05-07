# Gilded Reliquary — Task List per Refactoring

> **ISTRUZIONI PER IL MODELLO AI**
> Questo documento contiene una lista di task chirurgiche da eseguire su un progetto Nuxt 4 + Vue 3 + Pinia + SCSS.
> **Leggi TUTTE le regole di questa sezione prima di toccare qualsiasi file.**

---

## ⛔ REGOLE ASSOLUTE — NON VIOLARLE MAI

1. **NON riscrivere file interi.** Modifica SOLO le righe indicate in ogni task. Se una riga non è menzionata, non toccarla.
2. **NON aggiungere Tailwind CSS**, classi utility-first, o attributi `style=""` inline nei template Vue.
3. **NON usare `any` come tipo TypeScript.** Mai. Neanche come cast temporaneo.
4. **NON usare Options API Vue** (`export default { data() {} }`). Il progetto usa esclusivamente `<script setup lang="ts">`.
5. **NON aggiungere `<style>` o `<style scoped>` dentro file `.vue`.** Tutto lo stile è in `app/assets/scss/`.
6. **NON spostare file** da una cartella all'altra salvo dove esplicitamente indicato.
7. **NON installare nuove dipendenze npm.**
8. **NON modificare `nuxt.config.ts`**, `tsconfig.json`, `package.json`.
9. **NON toccare i file JSON** in `app/assets/data/` (sono dati statici del gioco).
10. **NON modificare `app/utils/save-parser.ts`** — è un parser binario delicato.
11. Ogni task è **indipendente**. Eseguile nell'ordine indicato. Se una task fallisce, fermati e segnalalo senza procedere alle successive.
12. Prima di ogni modifica, **mostrami il diff** (solo le righe che cambiano, non il file intero).

---

## STRUTTURA DEL PROGETTO (riferimento)

```
app/
├── assets/scss/
│   ├── abstracts/_variables.scss
│   ├── abstracts/_mixins.scss
│   ├── base/, components/, layout/, pages/
│   └── main.scss
├── components/
│   ├── layout/AppHeader.vue, AppSidebar.vue, MobileMenu.vue
│   └── wiki/CharacterSelector.vue, ItemCard.vue, ItemDetailCard.vue,
│            ItemGrid.vue, ItemInspector.vue, InventorySkeleton.vue, ReliquarySlot.vue
├── composables/
│   ├── useCategoryPage.ts
│   ├── useEldenRingApi.ts
│   └── useWikiItem.ts
├── layouts/default.vue
├── pages/
│   ├── index.vue
│   ├── archives/category.vue  (chiamato _category_.vue nei file forniti)
│   ├── inventory/category.vue (chiamato _category__1.vue nei file forniti)
│   └── wiki/[category]/[id].vue (chiamato _id_.vue)
├── plugins/save-store-persist.client.ts
├── shared/types/EldenRingApi.ts
├── stores/useSaveStore.ts
└── stores/useWikiStore.ts
```

---

---

# TASK 1 — Creare il tipo `ItemWithId` e `CategoryKey` condivisi

**File da modificare:** `app/shared/types/EldenRingApi.ts`

**Obiettivo:** Aggiungere in fondo al file due nuovi tipi che verranno usati dalle task successive. Non modificare nulla di ciò che esiste già nel file.

**Aggiungi SOLO queste righe alla fine del file:**

```typescript
// Tipo per le chiavi delle categorie interne (usato in store e composables)
export type CategoryKey =
  | 'armament'
  | 'armor'
  | 'ashesOfWar'
  | 'magic'
  | 'spiritAshes'
  | 'talisman'

// Tipo per un item del database con il suo ID aggiunto
export interface ItemData {
  name: string
  class?: string
  category?: string
}

export type ItemWithId = ItemData & { id: string }
```

**⛔ NON modificare** le interfacce `WikiEntity`, `ApiResponse`, i tipi `WikiCategory` o `ApiCategory` già presenti. Aggiungere solo alla fine.

---

# TASK 2 — Eliminare i tipi locali duplicati da `useSaveStore.ts`

**File da modificare:** `app/stores/useSaveStore.ts`

**Obiettivo:** Il file dichiara localmente `ItemData` e una interface `ItemDatabase`. Ora che `ItemData` vive in `shared/types/EldenRingApi.ts` (Task 1), va importata da lì. L'interface `ItemDatabase` rimane locale ma usa il tipo importato.

**Passo A — Sostituisci l'import esistente (riga 1):**

```diff
- import { defineStore } from 'pinia';
- import { SaveParser, type CharacterSlot } from '../utils/save-parser';
+ import { defineStore } from 'pinia'
+ import { SaveParser, type CharacterSlot } from '../utils/save-parser'
+ import type { ItemData, CategoryKey } from '~/shared/types/EldenRingApi'
```

Note: rimuovi anche il punto e virgola di fine riga (il progetto non usa semicolons negli import, come vedi dai composable).

**Passo B — Elimina le righe 5–9 del file originale** (la dichiarazione locale di `ItemData`):

```diff
- // Types for the JSON data structure
- interface ItemData {
-   name: string;
-   class?: string;
-   category?: string;
- }
```

**⛔ NON toccare** l'interfaccia `ItemDatabase` (righe 11–18 originali) né nessun'altra parte del file. Solo rimuovere la dichiarazione locale di `ItemData` e aggiungere l'import.

---

# TASK 3 — Eliminare `any[]` dai computed `missingItems` e `ownedItems` in `useSaveStore.ts`

**File da modificare:** `app/stores/useSaveStore.ts`

**Obiettivo:** I computed `missingItems` e `ownedItems` usano `[] as any[]`. Devono usare `ItemWithId[]` che viene da `shared/types/EldenRingApi.ts`.

**Passo A — Aggiorna l'import in cima al file** (già modificato nella Task 2, verifica che ci sia `ItemWithId`):

```diff
- import type { ItemData, CategoryKey } from '~/shared/types/EldenRingApi'
+ import type { ItemData, CategoryKey, ItemWithId } from '~/shared/types/EldenRingApi'
```

**Passo B — Nel computed `missingItems`**, sostituisci l'oggetto `missing` interno. Cerca questo blocco (circa righe 117–124):

```diff
-     const missing = {
-       armament: [] as any[],
-       armor: [] as any[],
-       ashesOfWar: [] as any[],
-       magic: [] as any[],
-       spiritAshes: [] as any[],
-       talisman: [] as any[],
-     };
+     const missing: Record<CategoryKey, ItemWithId[]> = {
+       armament: [],
+       armor: [],
+       ashesOfWar: [],
+       magic: [],
+       spiritAshes: [],
+       talisman: [],
+     }
```

**Passo C — Nel computed `ownedItems`**, sostituisci l'oggetto `owned` interno. Cerca il blocco simile (circa righe 147–154):

```diff
-     const owned = {
-       armament: [] as any[],
-       armor: [] as any[],
-       ashesOfWar: [] as any[],
-       magic: [] as any[],
-       spiritAshes: [] as any[],
-       talisman: [] as any[],
-     };
+     const owned: Record<CategoryKey, ItemWithId[]> = {
+       armament: [],
+       armor: [],
+       ashesOfWar: [],
+       magic: [],
+       spiritAshes: [],
+       talisman: [],
+     }
```

**⛔ NON modificare** la logica interna dei computed (i `forEach`, gli `Object.entries`, gli `if`). Solo le dichiarazioni degli oggetti.

---

# TASK 4 — Aggiungere `finally` mancante in `loadDatabase`

**File da modificare:** `app/stores/useSaveStore.ts`

**Obiettivo:** La funzione `loadDatabase` non ha un blocco `finally`, quindi se il `try` lancia un errore, `dbLoading` rimane `true` per sempre. Va corretto.

Cerca il blocco `catch` alla fine della funzione `loadDatabase` (circa riga 64–68):

```diff
-     } catch (error) {
-       const message = error instanceof Error ? error.message : 'Unknown error';
-       dbLoadError.value = `Failed to load item database: ${message}`;
-       if (import.meta.dev) console.error(dbLoadError.value, error)
-     }
+     } catch (error) {
+       const message = error instanceof Error ? error.message : 'Unknown error'
+       dbLoadError.value = `Failed to load item database: ${message}`
+       if (import.meta.dev) console.error(dbLoadError.value, error)
+     } finally {
+       dbLoading.value = false
+     }
```

**⛔ NON spostare** la riga `dbLoading.value = true` che è all'inizio della funzione. Lasciala dov'è.

---

# TASK 5 — Sostituire `JSON.parse(JSON.stringify(...))` con `structuredClone`

**File da modificare:** `app/stores/useSaveStore.ts`

**Obiettivo:** Sostituire il clone manuale del DB con la API moderna `structuredClone`.

Cerca questa riga (circa riga 47):

```diff
-       const baseDb: ItemDatabase = JSON.parse(JSON.stringify(all.default));
+       const baseDb: ItemDatabase = structuredClone(all.default as ItemDatabase)
```

**⛔ NON modificare** nessun'altra riga della funzione `loadDatabase`.

---

# TASK 6 — Rimuovere `as any` dal WikiStore

**File da modificare:** `app/stores/useWikiStore.ts`

**Obiettivo:** Il cast `as any` sulla riga del salvataggio in cache è non tipizzato. Va rimosso.

Cerca questa riga (circa riga 48):

```diff
-         cache.value[cacheKey] = response.data[0] as any
+         cache.value[cacheKey] = response.data[0] ?? null
```

**⛔ NON modificare** nessun'altra riga del file.

---

# TASK 7 — Eliminare `BASE_URL` duplicato dal WikiStore

**File da modificare:** `app/stores/useWikiStore.ts`

**Obiettivo:** La costante `BASE_URL` è definita dentro la funzione `fetchItemDetails` dello store, duplicando quella che esiste già in `useEldenRingApi.ts`. Va rimossa dallo store. Le chiamate `$fetch` che la usano però rimangono invariate (per ora lo store mantiene i suoi fetch interni — non è il momento di rifattorizzare quell'intera logica).

Cerca e rimuovi SOLO questa riga dentro la funzione `fetchItemDetails` (circa riga 33):

```diff
-       const BASE_URL = 'https://eldenring.fanapis.com/api'
```

Poi, sostituisci ogni occorrenza di `${BASE_URL}/` nello stesso file con il valore letterale `https://eldenring.fanapis.com/api/`:

```diff
-       let response = await $fetch<ApiResponse<WikiEntity[]>>(`${BASE_URL}/${finalCategory}`, {
+       let response = await $fetch<ApiResponse<WikiEntity[]>>(`https://eldenring.fanapis.com/api/${finalCategory}`, {

-         response = await $fetch<ApiResponse<WikiEntity[]>>(`${BASE_URL}/shields`, {
+         response = await $fetch<ApiResponse<WikiEntity[]>>(`https://eldenring.fanapis.com/api/shields`, {
```

**⛔ NON modificare** `useEldenRingApi.ts` dove `BASE_URL` è dichiarata correttamente a livello di modulo — quella rimane.

---

# TASK 8 — Sistemare il tipo `options` in `useEldenRingApi.getByName`

**File da modificare:** `app/composables/useEldenRingApi.ts`

**Obiettivo:** Il parametro `options: any = {}` nella funzione `getByName` viola la regola no-any. Va tipizzato correttamente. Inoltre il parametro `category` ha tipo `string` invece del tipo preciso `WikiCategory`.

Cerca la firma della funzione `getByName` (circa riga 26):

```diff
-   function getByName<T extends WikiEntity>(category: string, name: string, options: any = {}) {
+   function getByName<T extends WikiEntity>(
+     category: WikiCategory,
+     name: string,
+     options: Parameters<typeof useAsyncData>[2] = {}
+   ) {
```

**⛔ NON modificare** il corpo della funzione, né le altre funzioni `fetchEntity` e `fetchList`. Solo la firma di `getByName`.

---

# TASK 9 — Spostare `loadDatabase()` nel plugin, rimuoverla dal layout

**Obiettivo:** `loadDatabase()` è chiamata in `onMounted` nel layout `default.vue`. Il posto corretto è il plugin `.client.ts` che già gestisce la sessione. Così viene invocata una volta sola, al bootstrap del client, senza dipendere dal ciclo di vita del layout.

**Passo A — Modifica `app/plugins/save-store-persist.client.ts`:**

Trova il blocco che ripristina la sessione (circa righe 8–22) e aggiungi una riga **dopo** il blocco `if (raw) { ... }`, prima del `watch`:

```diff
   if (raw) {
     try {
       const saved = JSON.parse(raw)
       store.$patch({ ... })
     } catch {
       sessionStorage.removeItem(STORAGE_KEY)
     }
   }
+
+  // Avvia il caricamento del DB subito, senza aspettare il mount del layout
+  store.loadDatabase()

   watch(
```

**Passo B — Modifica `app/layouts/default.vue`:**

Rimuovi la riga `import` e il blocco `onMounted` che non servono più:

```diff
- import { useSaveStore } from '~/stores/useSaveStore'
-
- const store = useSaveStore()
- onMounted(() => { store.loadDatabase() })
```

Il file `default.vue` dopo la modifica deve avere SOLO il template, senza nessun `<script setup>` (o con uno `<script setup lang="ts">` vuoto se il template lo richiede — in questo caso il template non usa nessuna variabile dello script, quindi lo script può essere eliminato del tutto).

**Risultato atteso di `default.vue` dopo la modifica:**

```vue
<template>
  <div class="default-layout">
    <LayoutAppHeader />
    <LayoutAppSidebar />
    <main class="default-layout__main">
      <slot />
    </main>
  </div>
</template>
```

**⛔ NON modificare** il template di `default.vue`. NON toccare altri plugin.

---

# TASK 10 — Estrarre il composable `useInfiniteScroll`

**Obiettivo:** La logica dell'`IntersectionObserver` è identica in `archives/category.vue` e `inventory/category.vue`. Va estratta in un composable dedicato.

**Passo A — Crea il file `app/composables/useInfiniteScroll.ts`** con questo contenuto esatto:

```typescript
export function useInfiniteScroll(onIntersect: () => void, rootMargin = '300px') {
  const sentinel = useTemplateRef<HTMLElement>('sentinel')
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!sentinel.value) return
    observer = new IntersectionObserver(
      ([entry]) => { if (entry?.isIntersecting) onIntersect() },
      { rootMargin }
    )
    observer.observe(sentinel.value)
  })

  onUnmounted(() => observer?.disconnect())

  return { sentinel }
}
```

Note importanti sul file creato:
- `useTemplateRef` e i lifecycle hooks sono auto-importati da Nuxt, non serve importarli.
- Il `ref` template si chiama `'sentinel'` — deve corrispondere al `ref="sentinel"` già presente nei template delle pagine. **Non cambiarlo.**

**Passo B — Modifica `app/pages/archives/category.vue`:**

Rimuovi queste righe dallo `<script setup>`:

```diff
- const sentinel = useTemplateRef('sentinel')
-
- let _sentinelObserver: IntersectionObserver | null = null
-
- onMounted(() => {
-   if (!sentinel.value) return
-   _sentinelObserver = new IntersectionObserver(
-     (entries) => { if (entries[0]?.isIntersecting) loadMore() },
-     { rootMargin: '300px' }
-   )
-   _sentinelObserver.observe(sentinel.value)
- })
-
- onUnmounted(() => _sentinelObserver?.disconnect())
```

Aggiungi al loro posto questa riga (dopo la destructuring di `useCategoryPage`):

```diff
+ useInfiniteScroll(loadMore)
```

**Passo C — Modifica `app/pages/inventory/category.vue`** con le stesse identiche modifiche del Passo B.

**⛔ NON modificare** nessun'altra parte dei due file pagina. NON toccare il template. NON toccare `useCategoryPage`. Il `ref="sentinel"` nel template rimane invariato — è il composable che lo legge con `useTemplateRef`.

---

# TASK 11 — Creare `app/utils/categories.ts` (fonte di verità unica)

**Obiettivo:** La configurazione delle categorie (titolo, label, icona, lore) è ripetuta in `index.vue`, `AppSidebar.vue` e `useCategoryPage.ts`. Va centralizzata in un'unica utility.

**Passo A — Crea il file `app/utils/categories.ts`** con questo contenuto esatto:

```typescript
import type { CategoryKey } from '~/shared/types/EldenRingApi'

export interface CategoryConfig {
  title: string    // Titolo lungo usato nelle pagine (es. "Armaments & Weapons")
  label: string    // Label breve usata nella sidebar (es. "Weapons")
  icon: string     // Nome icona Material Symbols (senza prefisso)
  lore: string     // Testo lore usato nella home
}

export const CATEGORY_CONFIG = {
  armament:   {
    title: 'Armaments & Weapons',
    label: 'Weapons',
    icon: 'swords',
    lore: 'Hand-held instruments of destruction',
  },
  armor:      {
    title: 'Ancient Protections',
    label: 'Armor',
    icon: 'shield_person',
    lore: 'Tarnished steel and royal silk',
  },
  talisman:   {
    title: 'Sacred Talismans',
    label: 'Talismans',
    icon: 'brightness_7',
    lore: 'Sacred trinkets blessed by the Erdtree',
  },
  magic:      {
    title: 'Sorceries & Incantations',
    label: 'Magic',
    icon: 'auto_awesome',
    lore: 'Spells and incantations of the primeval current',
  },
  ashesOfWar: {
    title: 'Ashes of War',
    label: 'Ashes of War',
    icon: 'settings',
    lore: 'Techniques of legendary warriors',
  },
  spiritAshes: {
    title: 'Spectral Spirits',
    label: 'Spirit Ashes',
    icon: 'person_outline',
    lore: 'Spectral remains of fallen combatants',
  },
} satisfies Record<CategoryKey, CategoryConfig>

// Array ordinato delle chiavi — usato per iterare le categorie nell'ordine corretto
export const CATEGORY_KEYS = Object.keys(CATEGORY_CONFIG) as CategoryKey[]
```

**Passo B — Modifica `app/composables/useCategoryPage.ts`:**

Sostituisci il dizionario `CATEGORY_TITLES` locale con un import dalla utility:

```diff
+ import { CATEGORY_CONFIG } from '~/utils/categories'
  import { useSaveStore } from '~/stores/useSaveStore'

- type FilterValue = 'all' | 'owned' | 'missing'
- type CategoryKey = 'armament' | 'armor' | 'talisman' | 'magic' | 'ashesOfWar' | 'spiritAshes'
+ import type { CategoryKey } from '~/shared/types/EldenRingApi'
+
+ type FilterValue = 'all' | 'owned' | 'missing'
```

```diff
- const CATEGORY_TITLES: Record<string, string> = {
-   armament: 'Armaments & Weapons',
-   armor: 'Ancient Protections',
-   talisman: 'Sacred Talismans',
-   magic: 'Sorceries & Incantations',
-   ashesOfWar: 'Ashes of War',
-   spiritAshes: 'Spectral Spirits'
- }
```

```diff
-   const categoryTitle = computed(() => CATEGORY_TITLES[category.value] ?? 'The Archive')
+   const categoryTitle = computed(() =>
+     CATEGORY_CONFIG[category.value as CategoryKey]?.title ?? 'The Archive'
+   )
```

**⛔ NON modificare** nessun'altra logica del composable. Non toccare la paginazione, i computed `items`, `stats`, `selectedItem`.

---

# TASK 12 — Aggiornare `useSeoMeta` nelle pagine category

**Obiettivo:** `useSeoMeta` riceve un `computed()` wrappato, ma Nuxt accetta direttamente una getter function. Va semplificato in entrambe le pagine.

**Modifica `app/pages/archives/category.vue`:**

```diff
- useSeoMeta({ title: computed(() => `${categoryTitle.value} | Archives`) })
+ useSeoMeta({ title: () => `${categoryTitle.value} | Archives` })
```

**Modifica `app/pages/inventory/category.vue`:**

```diff
- useSeoMeta({ title: computed(() => `${categoryTitle.value} | Gilded Reliquary`) })
+ useSeoMeta({ title: () => `${categoryTitle.value} | Gilded Reliquary` })
```

**⛔ NON modificare** nessun'altra parte dei due file.

---

# TASK 13 — Rendere reattivi `route.params` in `wiki/[category]/[id].vue`

**File da modificare:** `app/pages/wiki/[category]/[id].vue` (il file chiamato `_id_.vue` nel riferimento)

**Obiettivo:** `route.params.category` e `route.params.id` sono letti una volta sola come variabili semplici. Se la route cambia lato client, i valori rimangono quelli vecchi. Devono diventare `computed`.

**Passo A — Rimuovi l'import esplicito di `useI18n`** (è auto-importato da `@nuxtjs/i18n` in Nuxt):

```diff
- import { useI18n } from 'vue-i18n'
  import type { WikiCategory } from '~/shared/types/EldenRingApi'
```

**Passo B — Rendi reattivi i parametri di route:**

```diff
- const category = route.params.category as string
- const id = route.params.id as string
-
- const { item, pending, error } = useWikiItem(category as WikiCategory, id)
+ const category = computed(() => route.params.category as WikiCategory)
+ const id = computed(() => route.params.id as string)
+
+ const { item, pending, error } = useWikiItem(category.value, id.value)
```

**⛔ NON modificare** il template del file. NON toccare `useSeoMeta`. NON toccare il composable `useWikiItem`.

---

# TASK 14 — Tipizzare `defineEmits` in `ItemDetailCard.vue`

**File da modificare:** `app/components/wiki/ItemDetailCard.vue`

**Obiettivo:** `defineEmits` è chiamato senza tipo. Va aggiunto il tipo esplicito.

Cerca la riga (circa riga 18):

```diff
- defineEmits(['select'])
+ const emit = defineEmits<{
+   select: [item: Item]
+ }>()
```

Aggiorna anche il template per usare `emit` invece di `$emit` inline (questa è la forma raccomandata con `<script setup>`):

Nel template, cerca:
```diff
- @click="$emit('select', item)"
+ @click="emit('select', item)"
```

**⛔ NON modificare** i `defineProps`, la logica dello script, o qualsiasi altra parte del template.

---

# TASK 15 — Correggere i valori hardcoded nel mixin `glass-panel`

**File da modificare:** `app/assets/scss/abstracts/_mixins.scss`

**Obiettivo:** Il mixin `glass-panel` usa valori hex letterali invece delle variabili SCSS già definite in `_variables.scss`.

Cerca il mixin `glass-panel` (righe 7–11):

```diff
  @mixin glass-panel {
    backdrop-filter: blur(20px);
-   background: rgba(19, 19, 21, 0.6);
-   border: 1px solid rgba(241, 201, 125, 0.1);
+   background: rgba($color-surface, 0.6);
+   border: 1px solid rgba($color-primary, 0.1);
  }
```

Analogamente per il mixin `gold-glow-text` (riga 14):

```diff
  @mixin gold-glow-text {
-   text-shadow: 0 0 15px rgba(241, 201, 125, 0.5);
+   text-shadow: 0 0 15px rgba($color-primary, 0.5);
  }
```

**⛔ NON modificare** nessun altro mixin. Le variabili `$color-surface` e `$color-primary` sono già disponibili perché il file inizia con `@use 'variables' as *`.

---

# TASK 16 — Aggiungere underscore `_` ai partial SCSS mancanti

**Obiettivo:** Il pattern 7-1 richiede che tutti i file SCSS che non generano CSS standalone abbiano il prefisso `_`. Alcuni file nel progetto ne sono privi.

**File da rinominare** (rinomina il file nel filesystem, poi aggiorna l'`@use` corrispondente in `main.scss`):

| Nome attuale | Nome corretto |
|---|---|
| `base/reset.scss` | `base/_reset.scss` |
| `base/typography.scss` | `base/_typography.scss` |
| `base/utilities.scss` | `base/_utilities.scss` |
| `layout/app-sidebar.scss` | `layout/_app-sidebar.scss` |
| `layout/default.scss` | `layout/_default.scss` |
| `components/inventory-skeleton.scss` | `components/_inventory-skeleton.scss` |
| `components/item-detail-card.scss` | `components/_item-detail-card.scss` |
| `components/item-inspector.scss` | `components/_item-inspector.scss` |
| `components/reliquary-slot.scss` | `components/_reliquary-slot.scss` |
| `pages/home.scss` | `pages/_home.scss` |
| `pages/inventory-detail.scss` | `pages/_inventory-detail.scss` |

**Dopo aver rinominato i file**, aggiorna `app/assets/scss/main.scss`. Sostituisci ogni `@use` che punta a un file rinominato. Sass risolve automaticamente i partial con e senza underscore, quindi in `main.scss` puoi mantenere la forma senza underscore negli `@use` (Sass li trova ugualmente). Tuttavia, per coerenza con la convezione, aggiorna anche il nome nelle stringhe `@use`:

```diff
- @use 'base/reset';
+ @use 'base/reset';   // nessuna modifica necessaria in @use — Sass trova _reset.scss
```

In pratica: **rinomina solo i file nel filesystem**. Non è necessario modificare `main.scss` perché Sass risolve `@use 'base/reset'` cercando sia `reset.scss` che `_reset.scss`. Se il tuo ambiente richiede il match esatto, aggiorna le stringhe `@use` aggiungendo il prefisso `_`.

**⛔ NON modificare** il contenuto interno di nessun file SCSS. Solo il nome del file.

---

## ✅ CHECKLIST DI VERIFICA FINALE

Dopo aver completato tutte le task, verifica questi punti:

- [ ] `grep -r "as any" app/` non ritorna risultati
- [ ] `grep -r "any\[\]" app/` non ritorna risultati
- [ ] `grep -r "JSON.parse(JSON.stringify" app/` non ritorna risultati
- [ ] `app/layouts/default.vue` non ha `<script setup>` (o ce l'ha vuoto)
- [ ] `app/stores/useWikiStore.ts` non contiene la costante `BASE_URL`
- [ ] `app/composables/useCategoryPage.ts` non contiene `CATEGORY_TITLES`
- [ ] `app/composables/useInfiniteScroll.ts` esiste
- [ ] `app/utils/categories.ts` esiste
- [ ] `app/shared/types/EldenRingApi.ts` esporta `CategoryKey`, `ItemData`, `ItemWithId`
- [ ] Il progetto compila senza errori TypeScript (`npx nuxi typecheck`)
- [ ] Il progetto si avvia senza errori (`npx nuxi dev`)
