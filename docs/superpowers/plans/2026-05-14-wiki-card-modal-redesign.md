# Wiki Card & Modal Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the full wiki item card clickable (remove "Wiki" button), and redesign both `ItemCard.vue` and `WikiItemModal.vue` to use the Gilded Reliquary design system.

**Architecture:** Two scoped rewrites — no new files, no new SCSS files, no store/composable changes. Styles live in each component's `<style scoped lang="scss">` block, which has auto-injected access to `$variables` and `mixins` via `vite.css.preprocessorOptions.scss.additionalData`.

**Tech Stack:** Nuxt 4 / Vue 3.5, SCSS with Vite auto-injection, `@nuxt/icon` (Iconify `material-symbols:*`), Pinia (`useWikiStore`), `@nuxtjs/i18n`.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `app/components/wiki/ItemCard.vue` | Full rewrite | Grid card — clickable, image + name + 2-line description |
| `app/components/wiki/WikiItemModal.vue` | Full rewrite | Detail modal — Cinzel title, gold divider, ghost-button CTA |

---

## Task 1: Rewrite `ItemCard.vue`

**Files:**
- Modify: `app/components/wiki/ItemCard.vue` (full rewrite)

### What changes
- Add `@click="openWikiModal"` to the root card div (currently missing — only the button had it)
- Remove `__actions` div and "Wiki" button entirely
- Replace generic layout with glass-panel design: square image area, Noto Serif name, Lora italic description (2-line clamp)
- Gold border + glow + image scale on hover
- Inline scoped SCSS (no external file needed)

- [ ] **Step 1: Replace `app/components/wiki/ItemCard.vue` with the redesigned version**

```vue
<script setup lang="ts">
import { useWikiStore } from '~/stores/useWikiStore'
import WikiItemModal from './WikiItemModal.vue'

interface Item {
  id: string
  name: string
}

const props = defineProps<{
  item: Item
  category: string
}>()

const wikiStore = useWikiStore()
const cardRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)
const isModalOpen = ref(false)

const apiInfo = computed(() => {
  if (!props.category || !props.item?.name) return null
  return wikiStore.getCachedItem(props.category, props.item.name)
})

const isPending = computed(() => {
  if (!props.category || !props.item?.name) return false
  return wikiStore.isItemLoading(props.category, props.item.name)
})

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!cardRef.value) return
  observer = new IntersectionObserver((entries) => {
    if (entries?.[0]?.isIntersecting) {
      isVisible.value = true
      if (props.category && props.item?.name) {
        wikiStore.fetchItemDetails(props.category, props.item.name)
      }
      observer?.disconnect()
      observer = null
    }
  }, { rootMargin: '200px', threshold: 0.01 })
  observer.observe(cardRef.value)
})

onUnmounted(() => {
  observer?.disconnect()
})

function openWikiModal() {
  if (props.category && props.item?.name) {
    wikiStore.fetchItemDetails(props.category, props.item.name)
    isModalOpen.value = true
  }
}
</script>

<template>
  <div
    ref="cardRef"
    class="wiki-item-card glass-panel"
    tabindex="0"
    role="button"
    :aria-label="item.name"
    @click="openWikiModal"
    @keydown.enter="openWikiModal"
    @keydown.space.prevent="openWikiModal"
  >
    <div class="wiki-item-card__image-wrap">
      <NuxtImg
        v-if="apiInfo?.image"
        :src="apiInfo.image"
        :alt="item.name"
        class="wiki-item-card__image"
        loading="lazy"
      />
      <div v-else-if="isPending" class="wiki-item-card__loader" />
      <Icon
        v-else
        name="material-symbols:image-outline"
        size="32"
        class="wiki-item-card__placeholder"
      />
    </div>

    <div class="wiki-item-card__info">
      <h4 class="wiki-item-card__name">{{ item.name }}</h4>
      <p v-if="apiInfo?.description" class="wiki-item-card__desc">
        {{ apiInfo.description }}
      </p>
    </div>

    <WikiItemModal
      v-if="isModalOpen"
      :category="category"
      :item-name="item.name"
      @close="isModalOpen = false"
    />
  </div>
</template>

<style scoped lang="scss">
.wiki-item-card {
  cursor: pointer;
  border-radius: $radius-sm;
  border: 1px solid rgba($color-outline, 0.2);
  overflow: hidden;
  transition: border-color $transition-base, box-shadow $transition-base;
  display: flex;
  flex-direction: column;

  &:hover {
    border-color: rgba($color-primary, 0.4);
    box-shadow: 0 0 20px rgba($color-primary, 0.1);

    .wiki-item-card__image {
      transform: scale(1.05);
    }

    .wiki-item-card__name {
      color: $color-primary;
    }
  }

  &__image-wrap {
    width: 100%;
    aspect-ratio: 1;
    background: rgba($color-surface-lowest, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-bottom: 1px solid rgba($color-outline, 0.1);
    transition: border-color $transition-base;

    .wiki-item-card:hover & {
      border-color: rgba($color-primary, 0.2);
    }
  }

  &__image {
    width: 85%;
    height: 85%;
    object-fit: contain;
    transition: transform $transition-slow;
    filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.5));
  }

  &__loader {
    width: 1.5rem;
    height: 1.5rem;
    border: 2px solid rgba($color-primary, 0.1);
    border-top-color: $color-primary;
    border-radius: 50%;
    animation: wiki-spin 1s linear infinite;
  }

  &__placeholder {
    opacity: 0.2;
    color: $color-primary;
  }

  &__info {
    padding: $space-4;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: $space-2;
  }

  &__name {
    font-family: $font-headline;
    font-size: 1.125rem;
    font-weight: 700;
    color: $color-on-surface;
    transition: color $transition-base;
    margin: 0;
  }

  &__desc {
    font-family: $font-lora;
    font-style: italic;
    font-size: $text-lore;
    line-height: 1.6;
    color: rgba($color-on-surface, 0.7);
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

@keyframes wiki-spin {
  to { transform: rotate(360deg); }
}
</style>
```

- [ ] **Step 2: Start dev server and verify card behavior**

Run: `pnpm dev`

Navigate to `/wiki/armament` (or any wiki category). Verify:
- Clicking anywhere on a card opens the modal (not just a button)
- No "Wiki" button visible
- Cards show: square image area (dark bg), Noto Serif name, italic description clamped to 2 lines
- Hover: gold border, subtle glow, image scales slightly, name turns gold
- Loading state: spinner in image-wrap when data is pending and no image yet

- [ ] **Step 3: Commit**

```bash
git add app/components/wiki/ItemCard.vue
git commit -m "feat: make wiki card fully clickable, redesign with design system"
```

---

## Task 2: Rewrite `WikiItemModal.vue`

**Files:**
- Modify: `app/components/wiki/WikiItemModal.vue` (full rewrite)

### What changes
- Cinzel uppercase gold title
- Label-style category subtitle above title
- Gold gradient divider between header and description
- `::before` pseudo-element for top rune accent (replaces `rune-border-top` mixin which conflicts with `border-radius`)
- Lora italic description
- Label + value pairs for `location`, `weight`, `quote` metadata
- Ghost-button style CTA ("View Full Page")
- Larger centered image (280px) with drop-shadow

- [ ] **Step 4: Replace `app/components/wiki/WikiItemModal.vue` with the redesigned version**

```vue
<script setup lang="ts">
import { useWikiStore } from '~/stores/useWikiStore'

interface Props {
  category: string
  itemName: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const localePath = useLocalePath()
const { t } = useI18n()
const wikiStore = useWikiStore()

const item = computed(() => wikiStore.getCachedItem(props.category, props.itemName))
const isLoading = computed(() => wikiStore.isItemLoading(props.category, props.itemName))
const categoryLabel = computed(() => t(`wiki.category.${props.category}`))

const close = () => emit('close')

const viewFullPage = () => {
  if (item.value) {
    navigateTo(localePath(`/wiki/${props.category}/${item.value.id || props.itemName}`))
    emit('close')
  }
}

onMounted(() => {
  wikiStore.fetchItemDetails(props.category, props.itemName)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.body.style.overflow = ''
})

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') close()
}
</script>

<template>
  <Teleport to="body">
    <div
      class="wiki-modal-overlay"
      @click.self="close"
      @keydown="handleKeydown"
      tabindex="-1"
    >
      <div
        class="wiki-modal glass-panel"
        role="dialog"
        aria-modal="true"
        :aria-label="item?.name"
      >
        <button
          class="wiki-modal__close"
          @click="close"
          :aria-label="$t('wiki.modal.close')"
        >
          <Icon name="material-symbols:close" size="24" />
        </button>

        <div v-if="isLoading" class="wiki-modal__loading">
          <div class="wiki-modal__loader" />
        </div>

        <div v-else-if="item" class="wiki-modal__content">
          <div class="wiki-modal__image-wrap">
            <NuxtImg
              v-if="item.image"
              :src="item.image"
              :alt="item.name"
              class="wiki-modal__image"
            />
            <Icon
              v-else
              name="material-symbols:image-outline"
              size="48"
              class="wiki-modal__image-placeholder"
            />
          </div>

          <div class="wiki-modal__header">
            <p class="wiki-modal__category">{{ categoryLabel }}</p>
            <h2 class="wiki-modal__title">{{ item.name }}</h2>
          </div>

          <div class="wiki-modal__divider" />

          <p v-if="item.description" class="wiki-modal__description">
            {{ item.description }}
          </p>

          <div v-if="item.location || item.weight || item.quote" class="wiki-modal__meta">
            <div v-if="item.location" class="wiki-modal__meta-row">
              <span class="wiki-modal__meta-label">{{ $t('wiki.label.location') }}</span>
              <span class="wiki-modal__meta-value">{{ item.location }}</span>
            </div>
            <div v-if="item.weight" class="wiki-modal__meta-row">
              <span class="wiki-modal__meta-label">{{ $t('wiki.label.weight') }}</span>
              <span class="wiki-modal__meta-value">{{ item.weight }}</span>
            </div>
            <div v-if="item.quote" class="wiki-modal__meta-row">
              <span class="wiki-modal__meta-label">{{ $t('wiki.label.quote') }}</span>
              <span class="wiki-modal__meta-value wiki-modal__meta-value--quote">{{ item.quote }}</span>
            </div>
          </div>

          <div class="wiki-modal__footer">
            <button class="wiki-modal__cta" @click="viewFullPage">
              {{ $t('wiki.modal.viewFull') }}
              <Icon name="material-symbols:arrow-forward" size="18" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.wiki-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: $space-4;
}

.wiki-modal {
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  border-radius: $radius-md;

  // Rune top accent via pseudo-element (border-image conflicts with border-radius)
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 10%;
    right: 10%;
    height: 1px;
    background: linear-gradient(to right, transparent, $color-primary, transparent);
  }

  &__close {
    position: absolute;
    top: $space-4;
    right: $space-4;
    background: none;
    border: none;
    color: rgba($color-on-surface, 0.5);
    cursor: pointer;
    padding: $space-2;
    transition: color $transition-fast;
    z-index: 1;

    &:hover {
      color: $color-on-surface;
    }
  }

  &__loading {
    display: flex;
    justify-content: center;
    padding: $space-12;
  }

  &__loader {
    width: 40px;
    height: 40px;
    border: 2px solid rgba($color-primary, 0.1);
    border-top-color: $color-primary;
    border-radius: 50%;
    animation: modal-spin 1s linear infinite;
  }

  &__content {
    padding: $space-8;
    display: flex;
    flex-direction: column;
    gap: $space-6;
  }

  &__image-wrap {
    width: 280px;
    height: 280px;
    margin: 0 auto;
    background: rgba($color-surface-lowest, 0.6);
    border: 1px solid rgba($color-outline, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  &__image {
    width: 85%;
    height: 85%;
    object-fit: contain;
    filter: drop-shadow(0 0 16px rgba(0, 0, 0, 0.6));
  }

  &__image-placeholder {
    opacity: 0.2;
    color: $color-primary;
  }

  &__header {
    text-align: center;
  }

  &__category {
    font-family: $font-label;
    font-size: $text-label;
    text-transform: uppercase;
    letter-spacing: 0.5em;
    color: $color-primary;
    opacity: 0.7;
    margin: 0 0 $space-2;
  }

  &__title {
    font-family: $font-cinzel;
    font-size: 1.75rem;
    font-weight: 700;
    text-transform: uppercase;
    color: $color-primary;
    margin: 0;
    line-height: 1.2;
  }

  &__divider {
    height: 1px;
    background: linear-gradient(to right, transparent, rgba($color-primary, 0.4), transparent);
  }

  &__description {
    font-family: $font-lora;
    font-style: italic;
    font-size: $text-lore;
    line-height: 1.7;
    color: rgba($color-on-surface, 0.85);
    margin: 0;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: $space-4;
  }

  &__meta-row {
    display: flex;
    flex-direction: column;
    gap: $space-1;
  }

  &__meta-label {
    font-family: $font-label;
    font-size: $text-label;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    color: rgba($color-on-surface, 0.4);
  }

  &__meta-value {
    font-family: $font-body;
    font-size: $text-body;
    color: $color-on-surface;

    &--quote {
      font-family: $font-lora;
      font-style: italic;
    }
  }

  &__footer {
    display: flex;
    justify-content: center;
    padding-top: $space-2;
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    padding: $space-3 $space-6;
    border: 1px solid rgba($color-primary, 0.3);
    background: rgba(169, 109, 23, 0.08);
    color: $color-primary;
    font-family: $font-label;
    font-size: $text-label;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    cursor: pointer;
    transition: background $transition-base, border-color $transition-base;
    border-radius: $radius-sm;

    &:hover {
      background: rgba($color-primary, 0.12);
      border-color: rgba($color-primary, 0.5);
    }
  }
}

@keyframes modal-spin {
  to { transform: rotate(360deg); }
}
</style>
```

- [ ] **Step 5: Verify modal in browser**

With dev server running, click a wiki card. Verify:
- Overlay opens with dark bg
- Gold rune line at top of modal (subtle gradient, not a hard border)
- Large square image (280px) centered with dark bg
- Category label above title: Space Grotesk uppercase, gold, muted opacity
- Title: Cinzel uppercase, gold, large
- Gold gradient divider line between header and description
- Description: Lora italic
- Metadata rows (location/weight/quote) only appear if item has that data — label-style label above value
- "View Full Page" button: ghost style (gold border, transparent bg → subtle gold fill on hover)
- Escape key closes modal
- Clicking overlay (outside modal box) closes modal

- [ ] **Step 6: Commit**

```bash
git add app/components/wiki/WikiItemModal.vue
git commit -m "feat: redesign wiki modal with Cinzel title, gold divider, ghost-button CTA"
```

---

## Self-Review Notes

- No `@use` for SCSS variables/mixins in `<style scoped>` — they are auto-injected by Vite (per `nuxt.config.ts`).
- `rune-border-top` mixin uses `border-image` which disables `border-radius`. Used `::before` pseudo-element instead — functionally identical gold gradient accent.
- `glass-panel` is a global CSS class applied via `@include glass-panel` in `base/utilities` — safe to use as a class on both components.
- No new i18n keys added — reuses `wiki.category.*`, `wiki.label.*`, `wiki.modal.*` keys already in `locales/en.json` and `locales/it.json`.
- `WikiItemCard` component name collision: old file was `ItemCard.vue`, new template class is `.wiki-item-card`. The page template in `wiki/[category]/index.vue` references `<WikiItemCard>` — Nuxt auto-imports by filename, so keep filename as `ItemCard.vue` to avoid breaking the page template.
