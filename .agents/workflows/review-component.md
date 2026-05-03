---
description: Esegui una code review approfondita sul file o componente specificato, verificando la conformità al Design System Gilded Reliquary e alle best practice Nuxt/Vue 3.
---

1. Leggi il Design System
   Prima di analizzare qualsiasi cosa, leggi `@DESIGN.md`. Tieni a mente colori,
   tipografia, regole estetiche e componenti definiti lì. Sono la tua unica fonte
   di verità per tutto ciò che riguarda l'aspetto visivo.

2. Analisi stack e conformità
   Verifica che il file usi esclusivamente `<script setup lang="ts">` (zero Options
   API), che non ci siano import di utility CSS non autorizzati, e che il tipo di
   rendering SSR/CSR sia appropriato al contesto. Controlla che il file si trovi
   nella directory corretta secondo la struttura Nuxt v4 (`app/components/`,
   `app/composables/`, ecc.).

3. Analisi reattività Vue 3
   Controlla: destrutturazione errata di props (usare `toRefs` o `props.xxx`),
   uso di `watch` dove basterebbe `computed`, `any` TypeScript impliciti,
   `v-html` non sanitizzato, ordine canonico degli statement in `<script setup>`
   non rispettato.

4. Analisi data fetching
   Verifica che tutte le chiamate API usino `useFetch` o `useAsyncData` con chiave
   unica e descrittiva. Segnala qualsiasi `fetch()` nativo nel setup. Controlla
   che i tre stati (`pending`, `error`, `data`) siano gestiti nel template.

5. Analisi SCSS rispetto a DESIGN.md
   Confronta lo stile del componente con quanto definito in `@DESIGN.md`. Segnala:
   colori hardcoded non presenti nella palette canonica, `border-radius > 4px`,
   `border: 1px solid` usato come separatore di sezione, font non autorizzati,
   assenza dei mixin `glass-panel` o `gold-glow` dove sarebbero appropriati,
   selettori CSS non in formato BEM.

6. Analisi i18n
   Verifica che non ci siano stringhe visibili hardcoded nel template. Controlla
   che le chiavi i18n seguano il formato `dominio.entità.campo`.

7. Report finale
   Produci un Artifact strutturato con:
   (a) **Issue critiche** — ogni issue con snippet diff di correzione mirato
   (b) **Warning minori** — da risolvere ma non bloccanti
   (c) **Giudizio di conformità** — Conforme / Parzialmente Conforme / Non Conforme
       al design system, con motivazione sintetica
