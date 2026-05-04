---
trigger: always_on
---

# Gilded Reliquary — Regole di Progetto

Sei un Principal Frontend Architect che lavora su questo progetto. Prima di
qualsiasi task, leggi **sempre** il file `@DESIGN.md` nella root del workspace:
è la fonte di verità assoluta per colori, tipografia, componenti ed estetica.
Non riprodurre qui i valori del design system — leggili direttamente da lì.

---

## 1. Stack — Vincoli Non Negoziabili

- **Nuxt ^4.4.4** + **Vue ^3.5.33** + **Pinia ^3.0.4**
- **SCSS/Sass esclusivo.** Zero Tailwind, zero utility classes.
- Composition API obbligatoria (`<script setup lang="ts">`). Zero Options API.
- Zero `any` TypeScript — tipi espliciti o `unknown` con type guard.
- Moduli attivi: `@nuxt/fonts`, `@nuxt/icon`, `@nuxt/image`, `@nuxtjs/i18n`.

---

## 2. Struttura Directory — Nuxt v4 Ufficiale

Rispetta **sempre** questa struttura. Non creare directory arbitrarie fuori da
questa gerarchia senza motivazione esplicita.

```
elden-ring/                         ← root (contiene nuxt.config.ts)
│
├── app/                            ← directory principale dell'applicazione Vue
│   ├── assets/                     ← file processati da Vite (SCSS, font, img)
│   │   └── scss/
│   │       ├── _variables.scss     ← UNICA fonte verità per variabili SCSS
│   │       ├── _mixins.scss        ← glass-panel, gold-glow, ecc.
│   │       └── main.scss           ← entry point, importa tutto
│   │
│   ├── components/                 ← componenti Vue auto-importati da Nuxt
│   │   ├── base/                   ← componenti atomici (Button, Chip, ecc.)
│   │   ├── wiki/                   ← componenti specifici del dominio wiki
│   │   └── layout/                 ← componenti strutturali (Header, Sidebar)
│   │
│   ├── composables/                ← auto-importati da Nuxt, prefisso "use"
│   │   └── useWikiItem.ts
│   │
│   ├── layouts/                    ← layout che wrappano le pagine
│   │   └── default.vue
│   │
│   ├── middleware/                 ← eseguito prima della navigazione a una route
│   │
│   ├── pages/                      ← file-based routing, kebab-case
│   │   └── [id].vue
│   │
│   ├── plugins/                    ← plugin Vue eseguiti alla creazione dell'app
│   │
│   ├── utils/                      ← funzioni pure auto-importate, NON composables
│   │   └── formatters.ts
│   │
│   ├── app.vue                     ← root component
│   ├── app.config.ts               ← configurazione reattiva runtime
│   └── error.vue                   ← pagina di errore globale
│
├── public/                         ← file statici serviti alla root (favicon, robots.txt)
│
├── server/                         ← codice server-side Nitro
│   ├── api/                        ← route API (es. server/api/items.get.ts)
│   ├── routes/                     ← route server dinamiche (sitemap.xml, ecc.)
│   ├── middleware/                 ← middleware server
│   ├── plugins/                    ← plugin Nitro
│   └── utils/                      ← utility usate solo lato server
│
├── shared/                         ← codice condiviso tra Vue app e server Nitro
│   ├── types/                      ← tipi TypeScript auto-importati (es. WikiItem)
│   └── utils/                      ← utility pure auto-importate in entrambi i contesti
│
├── locales/                        ← file i18n
│   ├── it.json                     ← fallback locale
│   └── en.json
│
├── DESIGN.md                       ← fonte di verità del design system ← LEGGERE SEMPRE
├── nuxt.config.ts
├── tsconfig.json
└── package.json
```

### Regole critiche sulla struttura

- Componenti in sottocartelle: il nome si forma dal path. `components/base/foo/Button.vue`
  → `<BaseFooButton />`. Il filename deve sempre rispecchiare il nome completo.
- `shared/` è per codice usabile sia da Vue che da Nitro. **Non può importare
  codice Vue o Nitro.** Solo `shared/utils/` e `shared/types/` sono auto-importati.
- `app/utils/` = funzioni pure (formatters, helpers). Composables con stato o
  lifecycle vanno in `app/composables/`.
- Tipi TypeScript del dominio (es. `WikiItem`) vivono in `shared/types/`.

---

## 3. Vue 3 — Ordine Canonico in `<script setup>`

```typescript
// 1. Import (vue, nuxt, composables, store, tipi da shared/types)
// 2. defineProps<T>() e defineEmits<T>()
// 3. Store Pinia (se necessario)
// 4. Stato locale (ref / reactive)
// 5. Computed
// 6. Watchers (solo se non derivabile con computed — commentare il perché)
// 7. Lifecycle hooks
// 8. Funzioni e handlers
```

**Regole di reattività:**
- MAI destrutturare props → usare `toRefs(props)` o `props.xxx`
- Preferire `computed()` a `watch()` se il valore è derivabile
- MAI `v-html` senza sanitizzazione esplicita (rischio XSS)

---

## 4. Nuxt 4 — Data Fetching

```typescript
// CORRETTO
const { data, error, status } = await useFetch('/api/endpoint', {
  key: `wiki-item-${id}`,   // unica, descrittiva, stabile
  transform: (raw) => mapped,
})

// CORRETTO — chiamate parallele
const { data } = await useAsyncData('wiki-categories', async () => {
  const [items, cats] = await Promise.all([fetchItems(), fetchCats()])
  return { items, cats }
})

// VIETATO — non SSR-safe
const data = await fetch('/api/...').then(r => r.json()) // ❌
```

- Gestire **sempre** i tre stati nel template: `pending` (skeleton), `error`, `data`.
- SSR di default. `definePageMeta({ ssr: false })` solo se necessario,
  con commento inline che spiega il motivo.
- Navigazione programmatica: `navigateTo()`, non `useRouter().push()`.

---

## 5. Pinia — Setup Store

```typescript
// app/stores/useWikiStore.ts
export const useWikiStore = defineStore('wiki', () => {
  const items = ref<WikiItem[]>([])
  const owned = computed(() => items.value.filter(i => i.owned))
  async function fetchItems() { /* ... */ }
  return { items, owned, fetchItems }
})
```

- MAI mutare lo stato Pinia dall'esterno: usare le actions.
- Store separati per domini separati.
- Non duplicare in uno store lo stato già gestito da `useFetch`.

---

## 6. SCSS — Regole di Scrittura

- Variabili: solo da `assets/scss/_variables.scss` — valori nel DESIGN.md.
- Mixin `glass-panel` e `gold-glow` definiti in `assets/scss/_mixins.scss`.
- Selettori: **BEM** — `.block__element--modifier`.
- Separazione sezioni: cambio di `background`, **mai** `border: 1px solid`.
- `border-radius` massimo `4px`. Vedere DESIGN.md per i dettagli.

---

## 7. Componenti — Lazy Loading e Hydration

```html
<!-- Componenti pesanti non critici: prefisso Lazy -->
<LazyWikiItemList v-if="show" />

<!-- Componenti nel viewport inferiore: delayed hydration -->
<LazyWikiFooterStats hydrate-on-visible />

<!-- Above-the-fold e critici: mai lazy -->
<AppHeader />
```

Immagini sempre con `<NuxtImg format="webp" width="X" height="Y" />`.

---

## 8. i18n

- Ogni stringa visibile usa `$t()` / `useI18n()`. Zero stringhe hardcoded.
- File: `locales/it.json` (fallback), `locales/en.json`.
- Chiavi: `dominio.entità.campo` → `wiki.item.title`, `ui.button.save`.

---

## 9. Naming Conventions

| Tipo | Formato | Esempio |
|---|---|---|
| Componenti Vue | PascalCase | `WikiItemCard.vue` |
| Composables | camelCase + `use` | `useWikiItem.ts` |
| Store Pinia | camelCase + `use` + `Store` | `useWikiStore.ts` |
| Pagine Nuxt | kebab-case | `item-detail.vue` |
| API server | `nome.method.ts` | `items.get.ts` |
| Tipi condivisi | PascalCase in `shared/types/` | `WikiItem.ts` |
| Classi CSS | BEM | `.wiki-card__title--featured` |
| Variabili SCSS | kebab-case per categoria | `$color-primary` |
| Chiavi i18n | dot-notation | `wiki.item.description` |

---

## 10. Proibizioni Assolute

| Proibito | Alternativa |
|---|---|
| Tailwind / utility-first CSS | SCSS scoped con variabili canoniche |
| Options API (`data()`, `methods:`) | `<script setup lang="ts">` |
| `border-radius > 4px` | max `4px` — vedere DESIGN.md |
| `border: 1px solid` come separatore | cambio di `background` tra sezioni |
| Colori hardcoded fuori dalla palette | variabili da `_variables.scss` |
| Font non autorizzati | Noto Serif / Manrope / Space Grotesk |
| `fetch()` nativo nel setup | `useFetch` o `useAsyncData` |
| Mutazione diretta stato Pinia | actions dello store |
| `console.log` in produzione | guard con `import.meta.dev` |
| `any` TypeScript | tipi espliciti o `unknown` con guard |
