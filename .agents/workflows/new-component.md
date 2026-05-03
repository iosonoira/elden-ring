---
description: Crea un nuovo componente Vue 3 seguendo la struttura canonica del progetto Gilded Reliquary, con SCSS scoped conforme al Design System.
---

1. Leggi il Design System
   Leggi `@DESIGN.md` prima di scrivere una singola riga. Colori, tipografia,
   regole su border-radius, glass panel, glow e comportamento dei componenti
   sono definiti lì. Non inventare valori — usa quelli documentati.

2. Definisci nome, posizione e responsabilità
   Stabilisci: nome PascalCase del componente, sottocartella corretta in
   `app/components/` (es. `base/`, `wiki/`, `layout/`), props con tipi TypeScript
   espliciti presi da `shared/types/`, eventi da emettere. Ricorda che la
   sottocartella diventa prefisso del nome: `components/base/Button.vue` →
   `<BaseButton />`.

3. Scaffold `<script setup lang="ts">`
   Rispetta l'ordine canonico:
   import → defineProps<T> → defineEmits<T> → store Pinia (se serve) →
   ref/reactive → computed → watch (solo se giustificato, con commento) →
   lifecycle → handlers.
   Zero Options API. Zero `any`. Tipi del dominio da `shared/types/`.

4. Scaffold `<template>`
   Struttura HTML semantica. Ogni stringa visibile wrapped in `$t()` con chiave
   nel formato `dominio.entità.campo`. Gestisci `pending` ed `error` se il
   componente consuma dati asincroni. Componenti pesanti con prefisso `<Lazy>`.
   Immagini con `<NuxtImg format="webp" width="X" height="Y" />`.

5. Scaffold `<style lang="scss" scoped>`
   Usa esclusivamente variabili da `assets/scss/_variables.scss` e mixin da
   `assets/scss/_mixins.scss` — i valori esatti sono nel DESIGN.md che hai già
   letto. Selettori in BEM. `border-radius` max 4px. Separazione sezioni con
   cambio di background, mai con border. Zero colori hardcoded. Zero font non
   autorizzati.

6. Verifica finale pre-consegna
   Prima di consegnare, auto-verifica:
   - nessuna proibizione violata (Tailwind, Options API, radius > 4px, ecc.)
   - naming convention e posizione nella directory corretti
   - chiavi i18n nel formato corretto
   - nessun valore estetico hardcoded non presente in DESIGN.md
