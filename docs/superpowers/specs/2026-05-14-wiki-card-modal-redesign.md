# Wiki Card & Modal Redesign

**Date:** 2026-05-14
**Scope:** `app/components/wiki/ItemCard.vue`, `app/components/wiki/WikiItemModal.vue`
**Goal:** Make the full card clickable (remove button), redesign both components to match the Gilded Reliquary design system.

---

## Problem

- `ItemCard.vue` has a "Wiki" button as the only click target — the card itself is not clickable.
- Card and modal visuals are too generic; they don't use the existing design tokens (glass-panel, gold accents, Cinzel/Lora/Noto typography, hover effects).

---

## Approach: Card-focused browse, modal carries detail

Card stays compact (image + name + description snippet). Modal is the primary detail surface (larger image, full metadata, navigation CTA).

---

## Component 1: WikiItemCard (replaces ItemCard.vue)

### Behavior
- Entire card is clickable → opens `WikiItemModal`.
- Remove the "Wiki" button and `__actions` div entirely.
- Keyboard accessible: `tabindex="0"`, `@keydown.enter` and `@keydown.space.prevent` call `openWikiModal`.
- Intersection observer lazy-loads API data (unchanged logic).

### Structure
```
div.wiki-item-card.glass-panel       @click="openWikiModal"
  div.wiki-item-card__image-wrap     aspect-ratio: 1, bg $color-surface-lowest
    NuxtImg                          drop-shadow filter, scale(1.05) on hover
    [loader spinner]                 shown when isPending and no image
    [placeholder icon]               material-symbols:image-outline, shown when no image and not pending
  div.wiki-item-card__info
    h4.wiki-item-card__name          Noto Serif ~1.125rem, → $color-primary on hover
    p.wiki-item-card__desc           Lora italic, font-size $text-lore, line-clamp: 2, only if apiInfo.description
```

### Hover state
- `border-color: rgba($color-primary, 0.4)`
- `gold-glow-box(0.1)`
- Image: `transform: scale(1.05)`
- Name: `color: $color-primary`

### Loading / empty states
- `isPending` + no image → spinner in image-wrap
- No `apiInfo` → name from `item.name` prop, no description shown

---

## Component 2: WikiItemModal

### Behavior
- Unchanged: opens via `WikiItemModal` Teleport, closes on overlay click or Escape key.
- "View Full Page" button navigates to `/wiki/[category]/[id]`.

### Structure
```
Teleport(body)
  div.wiki-modal-overlay             fixed inset-0, rgba(0,0,0,0.75), flex center
    div.wiki-modal.glass-panel       rune-border-top, max-width 640px, padding $space-8
      button.wiki-modal__close       position absolute top-right, X icon
      
      [loading]
        div.wiki-modal__loading      flex center, padding $space-12
          div.wiki-modal__loader     spinner (border-top $color-primary)
      
      [item loaded]
        div.wiki-modal__image-wrap   280px, aspect-ratio 1, bg $color-surface-lowest, centered
          NuxtImg                    drop-shadow filter, object-fit contain
        
        div.wiki-modal__header
          p.wiki-modal__category     label-style, $color-primary, opacity 0.7 (category name)
          h2.wiki-modal__title       Cinzel, uppercase, ~1.75rem, $color-primary
        
        div.wiki-modal__divider      rune-border-top (gold gradient line)
        
        p.wiki-modal__description    lore-text (Lora italic, 1rem, line-height 1.7)
        
        div.wiki-modal__meta         v-if any of: location, weight, quote
          div.wiki-modal__meta-row   flex col, gap $space-1, mb $space-4
            span.wiki-modal__meta-label  label-style, muted
            span.wiki-modal__meta-value  body font, $color-on-surface
        
        div.wiki-modal__footer
          button                     ghost-button mixin, "View Full Page" + arrow icon
```

---

## Design Tokens Used

| Token | Usage |
|---|---|
| `glass-panel` mixin | Card and modal background |
| `rune-border-top` mixin | Modal top accent + divider |
| `gold-glow-box(0.1)` | Card hover shadow |
| `$color-primary` | Name hover, title, category label |
| `$font-cinzel` | Modal title |
| `$font-headline` (Noto Serif) | Card name |
| `$font-lora` italic | Description (card + modal) |
| `label-style` mixin | Category label, meta labels |
| `ghost-button` mixin | Modal CTA |
| `$color-surface-lowest` | Image area background |
| `$transition-base` / `$transition-slow` | Hover transitions |

---

## Files Changed

| File | Change |
|---|---|
| `app/components/wiki/ItemCard.vue` | Full rewrite — clickable card, new layout, no button |
| `app/components/wiki/WikiItemModal.vue` | Full rewrite — Cinzel title, image redesign, ghost-button CTA |

No new files. No SCSS files added (styles scoped in components or already in `_wiki-category.scss`).

---

## Out of Scope

- `app/pages/wiki/[category]/index.vue` — no changes
- `app/stores/useWikiStore.ts` — no changes
- `app/composables/useWikiCategory.ts` — no changes
- i18n keys — reuse existing keys where possible, add only if necessary
