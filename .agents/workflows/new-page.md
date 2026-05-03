---
description: Crea una nuova pagina Nuxt con routing corretto, data fetching SSR-safe, meta SEO e conformità al Design System Gilded Reliquary.
---

1. Leggi il Design System
   Leggi `@DESIGN.md` prima di scrivere qualsiasi cosa. Layout, spaziatura,
   tipografia e scelte estetiche della pagina devono essere coerenti con quanto
   documentato lì.

2. Definisci route, parametri e rendering
   Nome file in kebab-case in `app/pages/`. Parametri dinamici con `[id].vue`,
   catch-all con `[...slug].vue`. Determina se la pagina richiede SSR (default)
   o CSR — se CSR, aggiungi `definePageMeta({ ssr: false })` con commento inline
   che spiega il motivo.

3. Configura meta e SEO
   ```typescript
   definePageMeta({ layout: 'default' })
   useSeoMeta({ title: '...', description: '...' })
   ```
   Tutte le stringhe dei meta tag attraverso `useI18n()`.

4. Data fetching SSR-safe
   Usa `useFetch` o `useAsyncData` con chiave univoca nel formato
   `wiki-[entità]-[parametro]`. Gestisci i tre stati nel template:
   - `pending`: skeleton loader visibile, non un semplice spinner generico
   - `error`: messaggio di errore accessibile e stilizzato secondo DESIGN.md
   - `data`: contenuto effettivo della pagina

5. Scaffold del template
   Struttura semantica con hierarchy heading corretta (un solo `<h1>`). Tutte le
   stringhe UI in `$t()` con chiavi `dominio.entità.campo`. Componenti pesanti
   o below-the-fold con `<LazyXxx>` e strategia di hydration appropriata
   (`hydrate-on-visible` per contenuti non critici). Immagini sempre con
   `<NuxtImg format="webp" width="X" height="Y" />`.

6. Scaffold `<style lang="scss" scoped>`
   Variabili da `assets/scss/_variables.scss`, mixin da `assets/scss/_mixins.scss`.
   Separazione sezioni con cambio di `background` — mai con `border`. Valori
   estetici coerenti con DESIGN.md. BEM per i selettori. `border-radius` max 4px.

7. Verifica finale pre-consegna
   - Chiave `useFetch`/`useAsyncData` unica e descrittiva
   - Nessun `fetch()` nativo nel setup
   - Nessuna stringa hardcoded nel template
   - Nessun valore estetico hardcoded non presente in DESIGN.md
   - Tutti e tre gli stati asincroni gestiti nel template
   - Un solo `<h1>` per pagina
