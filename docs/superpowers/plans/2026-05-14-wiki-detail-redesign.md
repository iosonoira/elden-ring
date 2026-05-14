# Wiki Detail Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the wiki item detail page to show all available API fields per category, with a large hero image and progress bars for numeric stats.

**Architecture:** Linear page layout — large centered hero image, italic lore text, then data sections rendered conditionally based on field existence. Four new reusable wiki components handle display of chips, stat bars, scaling badges, and drop lists.

**Tech Stack:** Nuxt 4, Vue 3, SCSS (variables/mixins auto-injected), `@nuxt/icon`, `@nuxtjs/i18n`

---

### Task 1: Extend WikiEntity type

**Files:**
- Modify: `app/shared/types/EldenRingApi.ts`

- [ ] **Step 1: Add missing fields to WikiEntity**

Replace the current `WikiEntity` interface in `app/shared/types/EldenRingApi.ts` with:

```ts
export interface WikiEntity {
  id: string
  name: string
  image: string
  description: string
  // Universal optional
  location?: string
  category?: string
  quote?: string
  weight?: number | string
  type?: string
  // Bosses / Creatures
  drops?: string[]
  region?: string
  healthPoints?: string
  // Weapons / Shields
  attack?: Array<{ name: string; amount: number }>
  defence?: Array<{ name: string; amount: number }>
  scalesWith?: Array<{ name: string; scaling: string }>
  requiredAttributes?: Array<{ name: string; amount: number }>
  // Armor
  dmgNegation?: Array<{ name: string; amount: number }>
  resistance?: Array<{ name: string; amount: number }>
  // Sorceries / Incantations
  cost?: number
  slots?: number
  effects?: string
  requires?: Array<{ name: string; amount: number }>
  // Spirit Ashes / Spirits
  fpCost?: string
  hpCost?: string
  effect?: string
  // Ashes of War
  affinity?: string
  skill?: string
  // NPCs
  role?: string
}
```

- [ ] **Step 2: Commit**

```bash
git add app/shared/types/EldenRingApi.ts
git commit -m "feat(types): extend WikiEntity with all Fan API fields"
```

---

### Task 2: Add i18n keys

**Files:**
- Modify: `locales/en.json`
- Modify: `locales/it.json`

- [ ] **Step 1: Add keys to en.json**

Inside `wiki.label` object (add after existing `weight` key):

```json
"info": "Info",
"stats": "Attack",
"defence": "Defence",
"dmgNegation": "Damage Negation",
"resistance": "Resistance",
"scaling": "Attribute Scaling",
"requirements": "Requirements",
"drops": "Drops",
"effect": "Effect",
"affinity": "Affinity",
"skill": "Skill",
"fpCost": "FP Cost",
"hpCost": "HP Cost",
"healthPoints": "Health Points",
"region": "Region",
"role": "Role",
"slots": "Memory Slots",
"spellType": "Type",
"itemType": "Category"
```

The full `wiki.label` block in `locales/en.json` after editing:

```json
"label": {
  "location": "Location",
  "quote": "Ancient Quote",
  "weight": "Weight",
  "info": "Info",
  "stats": "Attack",
  "defence": "Defence",
  "dmgNegation": "Damage Negation",
  "resistance": "Resistance",
  "scaling": "Attribute Scaling",
  "requirements": "Requirements",
  "drops": "Drops",
  "effect": "Effect",
  "affinity": "Affinity",
  "skill": "Skill",
  "fpCost": "FP Cost",
  "hpCost": "HP Cost",
  "healthPoints": "Health Points",
  "region": "Region",
  "role": "Role",
  "slots": "Memory Slots",
  "spellType": "Type",
  "itemType": "Category"
}
```

- [ ] **Step 2: Add keys to it.json**

The full `wiki.label` block in `locales/it.json` after editing:

```json
"label": {
  "location": "Luogo Certo",
  "quote": "Citazione Antica",
  "weight": "Peso",
  "info": "Info",
  "stats": "Attacco",
  "defence": "Difesa",
  "dmgNegation": "Riduzione Danno",
  "resistance": "Resistenza",
  "scaling": "Scalatura Attributi",
  "requirements": "Requisiti",
  "drops": "Bottino",
  "effect": "Effetto",
  "affinity": "Affinità",
  "skill": "Abilità",
  "fpCost": "Costo FP",
  "hpCost": "Costo HP",
  "healthPoints": "Punti Vita",
  "region": "Regione",
  "role": "Ruolo",
  "slots": "Slot Memoria",
  "spellType": "Tipo",
  "itemType": "Categoria"
}
```

- [ ] **Step 3: Commit**

```bash
git add locales/en.json locales/it.json
git commit -m "feat(i18n): add wiki detail label keys for all API fields"
```

---

### Task 3: WikiChip component

**Files:**
- Create: `app/components/wiki/WikiChip.vue`

- [ ] **Step 1: Create the component**

Create `app/components/wiki/WikiChip.vue`:

```vue
<script setup lang="ts">
defineProps<{ label: string; value: string | number }>()
</script>

<template>
  <div class="wiki-chip">
    <span class="wiki-chip__label">{{ label }}</span>
    <span class="wiki-chip__value">{{ value }}</span>
  </div>
</template>

<style scoped lang="scss">
.wiki-chip {
  display: flex;
  flex-direction: column;
  gap: $space-1;
  padding: $space-3 $space-4;
  background-color: $color-surface-container;
  border-radius: $radius-md;
  min-width: 100px;

  &__label {
    font-family: $font-label;
    font-size: $text-label;
    letter-spacing: 0.5em;
    text-transform: uppercase;
    color: $color-primary;
  }

  &__value {
    font-family: $font-body;
    font-size: $text-body;
    color: $color-on-surface;
    line-height: 1.4;
  }
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add app/components/wiki/WikiChip.vue
git commit -m "feat(wiki): add WikiChip component"
```

---

### Task 4: WikiStatBar component

**Files:**
- Create: `app/components/wiki/WikiStatBar.vue`

- [ ] **Step 1: Create the component**

Create `app/components/wiki/WikiStatBar.vue`:

```vue
<script setup lang="ts">
const props = defineProps<{ name: string; amount: number; max: number }>()
const percentage = computed(() => Math.min((props.amount / props.max) * 100, 100))
</script>

<template>
  <div class="wiki-stat-bar">
    <span class="wiki-stat-bar__name">{{ name }}</span>
    <div class="wiki-stat-bar__track">
      <div class="wiki-stat-bar__fill" :style="{ width: `${percentage}%` }" />
    </div>
    <span class="wiki-stat-bar__value">{{ amount }}</span>
  </div>
</template>

<style scoped lang="scss">
.wiki-stat-bar {
  display: grid;
  grid-template-columns: 140px 1fr 48px;
  align-items: center;
  gap: $space-4;

  &__name {
    font-family: $font-label;
    font-size: $text-label;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: $color-on-surface-variant;
  }

  &__track {
    height: 3px;
    background-color: $color-surface-container-highest;
    border-radius: $radius-sm;
    overflow: hidden;
  }

  &__fill {
    height: 100%;
    background: linear-gradient(90deg, $color-primary-container, $color-primary);
    border-radius: $radius-sm;
    transition: width $transition-slow;
  }

  &__value {
    font-family: $font-body;
    font-size: $text-body;
    color: $color-on-surface;
    text-align: right;
  }
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add app/components/wiki/WikiStatBar.vue
git commit -m "feat(wiki): add WikiStatBar component with gold progress bar"
```

---

### Task 5: WikiScalingBadge component

**Files:**
- Create: `app/components/wiki/WikiScalingBadge.vue`

- [ ] **Step 1: Create the component**

Create `app/components/wiki/WikiScalingBadge.vue`:

```vue
<script setup lang="ts">
const props = defineProps<{ name: string; scaling: string }>()

const tierColor = computed(() => {
  const map: Record<string, string> = {
    S: '#f1c97d',
    A: '#e8834a',
    B: '#d4c44a',
    C: '#6ab04c',
    D: '#888888',
    E: '#444444',
  }
  return map[props.scaling.toUpperCase()] ?? '#888888'
})
</script>

<template>
  <div class="wiki-scaling-badge">
    <span class="wiki-scaling-badge__name">{{ name }}</span>
    <span class="wiki-scaling-badge__tier" :style="{ color: tierColor }">{{ scaling }}</span>
  </div>
</template>

<style scoped lang="scss">
.wiki-scaling-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-1;
  padding: $space-3 $space-4;
  background-color: $color-surface-container;
  border-radius: $radius-md;
  min-width: 64px;

  &__name {
    font-family: $font-label;
    font-size: $text-label;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: $color-on-surface-variant;
  }

  &__tier {
    font-family: $font-cinzel;
    font-size: $text-subheader;
    font-weight: 700;
    line-height: 1;
  }
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add app/components/wiki/WikiScalingBadge.vue
git commit -m "feat(wiki): add WikiScalingBadge component with tier colors"
```

---

### Task 6: WikiDropList component

**Files:**
- Create: `app/components/wiki/WikiDropList.vue`

- [ ] **Step 1: Create the component**

Create `app/components/wiki/WikiDropList.vue`:

```vue
<script setup lang="ts">
defineProps<{ drops: string[] }>()
</script>

<template>
  <ul class="wiki-drop-list">
    <li v-for="drop in drops" :key="drop" class="wiki-drop-list__item">
      <Icon name="material-symbols:diamond-outline" size="14" class="wiki-drop-list__icon" />
      <span>{{ drop }}</span>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.wiki-drop-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: $space-2;

  &__item {
    display: flex;
    align-items: center;
    gap: $space-3;
    font-family: $font-body;
    font-size: $text-body;
    color: $color-on-surface;
    padding: $space-2 0;
  }

  &__icon {
    color: $color-primary;
    flex-shrink: 0;
  }
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add app/components/wiki/WikiDropList.vue
git commit -m "feat(wiki): add WikiDropList component"
```

---

### Task 7: Rewrite _wiki-detail.scss

**Files:**
- Modify: `app/assets/scss/pages/_wiki-detail.scss`

- [ ] **Step 1: Replace the file contents**

Replace the entire contents of `app/assets/scss/pages/_wiki-detail.scss` with:

```scss
@use "../abstracts/variables" as *;
@use "../abstracts/mixins" as *;

.wiki-page {
  padding: $space-4 $space-6;
  min-height: 100vh;

  &__header {
    background-color: $color-surface-low;
    padding: $space-4 $space-6;
    margin: (-$space-4) (-$space-6) $space-8 (-$space-6);
  }

  &__title {
    font-family: $font-cinzel;
    font-size: $text-hero;
    color: $color-primary;
    text-transform: uppercase;
    margin: 0;
    line-height: 1.1;
  }

  &__type {
    @include label-style;
    color: $color-on-surface-variant;
    margin-top: $space-2;
  }

  // Hero image block — centered, large
  &__hero {
    display: flex;
    justify-content: center;
    padding: $space-12 $space-6;
    margin: 0 (-$space-6);
    background: radial-gradient(ellipse at center, rgba($color-surface-container-high, 0.5) 0%, transparent 70%);
  }

  &__hero-image {
    max-width: 500px;
    width: 100%;
    height: auto;
    aspect-ratio: 1;
    object-fit: contain;
    filter: drop-shadow(0 0 30px rgba($color-primary, 0.3));
  }

  // Lore description below image
  &__lore {
    @include lore-text;
    color: $color-on-surface;
    text-align: center;
    max-width: 680px;
    margin: 0 auto $space-10;
  }

  // Generic data section
  &__section {
    margin-bottom: $space-10;
  }

  &__section-title {
    @include label-style;
    color: $color-primary;
    margin-bottom: $space-4;
    display: block;
  }

  // Flex-wrap grid for WikiChip items
  &__chips-grid {
    display: flex;
    flex-wrap: wrap;
    gap: $space-3;
  }

  // List of WikiStatBar items
  &__stat-list {
    display: flex;
    flex-direction: column;
    gap: $space-3;
    background-color: $color-surface-lowest;
    padding: $space-5 $space-6;
    border-radius: $radius-md;
  }

  // Row of WikiScalingBadge items
  &__badges-row {
    display: flex;
    flex-wrap: wrap;
    gap: $space-3;
  }

  // Quote blockquote
  &__quote-block {
    @include lore-text;
    color: $color-on-surface-variant;
    padding-left: $space-6;
    margin: 0;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 2px;
      background: $color-primary;
      opacity: 0.35;
      border-radius: $radius-sm;
    }
  }

  // Effect / effects plain text
  &__effect-text {
    font-family: $font-body;
    font-size: $text-body;
    line-height: 1.6;
    color: $color-on-surface;
    margin: 0;
  }

  // Breadcrumb
  &__breadcrumb {
    display: flex;
    align-items: center;
    gap: $space-2;
    margin-bottom: $space-6;
    font-family: $font-label;
    font-size: $text-label;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: $color-on-surface-variant;

    a {
      color: $color-on-surface-variant;
      text-decoration: none;
      transition: color $transition-fast;

      &:hover {
        color: $color-primary;
      }
    }

    span {
      color: $color-primary;
    }
  }

  // Skeleton loading state
  &__skeleton {
    display: flex;
    flex-direction: column;
    gap: $space-8;

    @media (min-width: 768px) {
      flex-direction: row;
    }

    &-img {
      flex: 0 0 320px;
      height: 320px;
      background: $color-surface-container-highest;
      animation: pulse 1.5s infinite ease-in-out;
      border-radius: $radius-default;
    }

    &-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: $space-4;
    }

    &-text {
      width: 100%;
      height: 24px;
      background: $color-surface-container-highest;
      animation: pulse 1.5s infinite ease-in-out;
      border-radius: $radius-sm;

      &--hero {
        height: 60px;
        width: 70%;
        margin-bottom: $space-6;
      }

      &:last-child {
        width: 60%;
      }
    }
  }

  // Error state
  &__error {
    padding: $space-6;
    background: rgba($color-error-container, 0.2);
    border-radius: $radius-md;
    text-align: center;

    .error-title {
      font-family: $font-headline;
      font-size: $text-subheader;
      color: $color-error;
      margin-bottom: $space-2;
    }

    .error-message {
      font-family: $font-body;
      font-size: $text-body;
      color: $color-on-surface;
    }
  }
}

@keyframes pulse {
  0% { opacity: 0.3; }
  50% { opacity: 0.6; }
  100% { opacity: 0.3; }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/assets/scss/pages/_wiki-detail.scss
git commit -m "refactor(scss): rewrite wiki-detail styles for new linear layout"
```

---

### Task 8: Redesign [id].vue page

**Files:**
- Modify: `app/pages/wiki/[category]/[id].vue`

- [ ] **Step 1: Replace the page with the new template**

Replace the entire contents of `app/pages/wiki/[category]/[id].vue` with:

```vue
<script setup lang="ts">
import type { WikiCategory, WikiEntity } from '~/shared/types/EldenRingApi'

definePageMeta({ layout: 'default' })

const route = useRoute()
const localePath = useLocalePath()
const { t } = useI18n()

const category = computed(() => route.params.category as WikiCategory)
const id = computed(() => route.params.id as string)

const { item, pending, error } = useWikiItem<WikiEntity>(category, id)

useSeoMeta({
  title: computed(() => item.value?.name ? `${item.value.name} | Gilded Reliquary` : t('wiki.page.titleFallback')),
  description: computed(() => item.value?.description || t('wiki.page.descFallback'))
})

// hpCost "0" means no HP cost — filter it out
const hasHpCost = computed(() => item.value?.hpCost && item.value.hpCost !== '0')

// Combined requirements: weapons use requiredAttributes, spells use requires
const requirements = computed(() => item.value?.requiredAttributes ?? item.value?.requires ?? [])

// Info chips: all simple key-value fields that exist
const hasInfoSection = computed(() =>
  !!(item.value?.location || item.value?.weight || item.value?.type ||
     item.value?.category || item.value?.role || item.value?.region ||
     item.value?.healthPoints || item.value?.fpCost || hasHpCost.value ||
     item.value?.affinity || item.value?.skill || item.value?.slots || item.value?.cost)
)
</script>

<template>
  <div class="wiki-page">
    <!-- Breadcrumb -->
    <nav class="wiki-page__breadcrumb">
      <NuxtLink :to="localePath('/wiki')">{{ $t('wiki.index.title') }}</NuxtLink>
      <Icon name="material-symbols:chevron-right" size="16" />
      <NuxtLink :to="localePath(`/wiki/${category}`)">{{ $t(`wiki.category.${category}`) }}</NuxtLink>
      <Icon name="material-symbols:chevron-right" size="16" />
      <span>{{ item?.name }}</span>
    </nav>

    <!-- Pending State -->
    <div v-if="pending" class="wiki-page__skeleton">
      <div class="wiki-page__skeleton-img" />
      <div class="wiki-page__skeleton-info">
        <div class="wiki-page__skeleton-text wiki-page__skeleton-text--hero" />
        <div class="wiki-page__skeleton-text" />
        <div class="wiki-page__skeleton-text" />
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="wiki-page__error">
      <h2 class="error-title">{{ $t('wiki.error.title') }}</h2>
      <p class="error-message">{{ $t('wiki.error.message') }}</p>
    </div>

    <!-- Data Loaded -->
    <div v-else-if="item" class="wiki-page__content">
      <header class="wiki-page__header">
        <h1 class="wiki-page__title">{{ item.name }}</h1>
        <p class="wiki-page__type">{{ $t(`wiki.category.${category}`) }}</p>
      </header>

      <!-- Hero Image -->
      <div class="wiki-page__hero">
        <NuxtImg
          v-if="item.image"
          :src="item.image"
          format="webp"
          width="500"
          height="500"
          class="wiki-page__hero-image"
          :alt="item.name"
        />
      </div>

      <!-- Lore description -->
      <p class="wiki-page__lore">{{ item.description }}</p>

      <!-- Info chips -->
      <section v-if="hasInfoSection" class="wiki-page__section">
        <span class="wiki-page__section-title">{{ $t('wiki.label.info') }}</span>
        <div class="wiki-page__chips-grid">
          <WikiChip v-if="item.location" :label="$t('wiki.label.location')" :value="item.location" />
          <WikiChip v-if="item.weight" :label="$t('wiki.label.weight')" :value="item.weight" />
          <WikiChip v-if="item.category" :label="$t('wiki.label.itemType')" :value="item.category" />
          <WikiChip v-if="item.type" :label="$t('wiki.label.spellType')" :value="item.type" />
          <WikiChip v-if="item.role" :label="$t('wiki.label.role')" :value="item.role" />
          <WikiChip v-if="item.region" :label="$t('wiki.label.region')" :value="item.region" />
          <WikiChip v-if="item.healthPoints" :label="$t('wiki.label.healthPoints')" :value="item.healthPoints" />
          <WikiChip v-if="item.cost" :label="$t('wiki.label.fpCost')" :value="item.cost" />
          <WikiChip v-if="item.slots" :label="$t('wiki.label.slots')" :value="item.slots" />
          <WikiChip v-if="item.fpCost" :label="$t('wiki.label.fpCost')" :value="item.fpCost" />
          <WikiChip v-if="hasHpCost" :label="$t('wiki.label.hpCost')" :value="item.hpCost!" />
          <WikiChip v-if="item.affinity" :label="$t('wiki.label.affinity')" :value="item.affinity" />
          <WikiChip v-if="item.skill" :label="$t('wiki.label.skill')" :value="item.skill" />
        </div>
      </section>

      <!-- Quote -->
      <section v-if="item.quote" class="wiki-page__section">
        <span class="wiki-page__section-title">{{ $t('wiki.label.quote') }}</span>
        <blockquote class="wiki-page__quote-block">{{ item.quote }}</blockquote>
      </section>

      <!-- Effect / Effects text -->
      <section v-if="item.effect || item.effects" class="wiki-page__section">
        <span class="wiki-page__section-title">{{ $t('wiki.label.effect') }}</span>
        <p class="wiki-page__effect-text">{{ item.effect || item.effects }}</p>
      </section>

      <!-- Attack stats -->
      <section v-if="item.attack?.length" class="wiki-page__section">
        <span class="wiki-page__section-title">{{ $t('wiki.label.stats') }}</span>
        <div class="wiki-page__stat-list">
          <WikiStatBar
            v-for="stat in item.attack"
            :key="stat.name"
            :name="stat.name"
            :amount="stat.amount"
            :max="300"
          />
        </div>
      </section>

      <!-- Defence stats -->
      <section v-if="item.defence?.length" class="wiki-page__section">
        <span class="wiki-page__section-title">{{ $t('wiki.label.defence') }}</span>
        <div class="wiki-page__stat-list">
          <WikiStatBar
            v-for="stat in item.defence"
            :key="stat.name"
            :name="stat.name"
            :amount="stat.amount"
            :max="100"
          />
        </div>
      </section>

      <!-- Damage Negation (armor) -->
      <section v-if="item.dmgNegation?.length" class="wiki-page__section">
        <span class="wiki-page__section-title">{{ $t('wiki.label.dmgNegation') }}</span>
        <div class="wiki-page__stat-list">
          <WikiStatBar
            v-for="stat in item.dmgNegation"
            :key="stat.name"
            :name="stat.name"
            :amount="stat.amount"
            :max="100"
          />
        </div>
      </section>

      <!-- Resistance (armor) -->
      <section v-if="item.resistance?.length" class="wiki-page__section">
        <span class="wiki-page__section-title">{{ $t('wiki.label.resistance') }}</span>
        <div class="wiki-page__stat-list">
          <WikiStatBar
            v-for="stat in item.resistance"
            :key="stat.name"
            :name="stat.name"
            :amount="stat.amount"
            :max="100"
          />
        </div>
      </section>

      <!-- Attribute Scaling -->
      <section v-if="item.scalesWith?.length" class="wiki-page__section">
        <span class="wiki-page__section-title">{{ $t('wiki.label.scaling') }}</span>
        <div class="wiki-page__badges-row">
          <WikiScalingBadge
            v-for="scale in item.scalesWith"
            :key="scale.name"
            :name="scale.name"
            :scaling="scale.scaling"
          />
        </div>
      </section>

      <!-- Requirements -->
      <section v-if="requirements.length" class="wiki-page__section">
        <span class="wiki-page__section-title">{{ $t('wiki.label.requirements') }}</span>
        <div class="wiki-page__chips-grid">
          <WikiChip
            v-for="req in requirements"
            :key="req.name"
            :label="req.name"
            :value="req.amount"
          />
        </div>
      </section>

      <!-- Drops -->
      <section v-if="item.drops?.length" class="wiki-page__section">
        <span class="wiki-page__section-title">{{ $t('wiki.label.drops') }}</span>
        <WikiDropList :drops="item.drops" />
      </section>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Start dev server and verify in browser**

```bash
pnpm dev
```

Open: `http://localhost:3000/wiki/bosses` → click any boss → verify:
- Image is large and centered with gold glow
- Lore text centered below
- Info chips show location, healthPoints, region
- Drops section shows drop list with diamond icons

Open: `http://localhost:3000/wiki/armament` → click any weapon → verify:
- Attack stat bars with gold fill
- Defence stat bars
- Scaling badges with tier colors (S=gold, A=orange, etc.)
- Requirements chips

Open: `http://localhost:3000/wiki/armor` → click any armor → verify:
- Damage Negation bars
- Resistance bars

Open: `http://localhost:3000/wiki/magic` or `/spiritAshes` → verify:
- FP Cost chip
- Slots chip (magic)
- HP Cost chip hidden when "0"
- Effect text block

- [ ] **Step 3: Commit**

```bash
git add app/pages/wiki/[category]/[id].vue
git commit -m "feat(wiki): redesign detail page with hero image and category-specific sections"
```

---

## Self-Review

**Spec coverage:**
- ✅ Image large and centered (Task 7 + 8 `__hero` + `__hero-image`)
- ✅ All API fields displayed (Tasks 1, 8)
- ✅ Progress bars for numeric stats (Task 4 + 8)
- ✅ WikiChip for simple key-value (Task 3 + 8)
- ✅ WikiScalingBadge with tier colors (Task 5 + 8)
- ✅ WikiDropList for drops (Task 6 + 8)
- ✅ Category-specific sections via v-if on field existence (Task 8)
- ✅ i18n keys (Task 2)
- ✅ SCSS only in `_wiki-detail.scss` (Task 7)
- ✅ hpCost "0" filtered out (Task 8 `hasHpCost`)

**Placeholder scan:** None found. All code steps are complete.

**Type consistency:**
- `WikiEntity` extended in Task 1, used in Task 8
- `WikiChip` props `{ label: string, value: string | number }` — all usages in Task 8 match
- `WikiStatBar` props `{ name: string, amount: number, max: number }` — all usages pass correct types
- `WikiScalingBadge` props `{ name: string, scaling: string }` — matches `scalesWith` array shape
- `WikiDropList` props `{ drops: string[] }` — matches `item.drops`
- `requirements` computed combines `requiredAttributes` and `requires` — both are `Array<{ name: string; amount: number }>` per Task 1
