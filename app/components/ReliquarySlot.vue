<script setup lang="ts">
import { ref } from 'vue'

interface ReliquarySlotProps {
  /** Icon name (Nuxt Icon / Material Symbols id, e.g. "material-symbols:history-edu-outline") */
  icon: string
  title: string
  /** Fraction of the collapsed progress bar filled (0–1). Signals completion metaphor. */
  progress?: number
}

const props = withDefaults(defineProps<ReliquarySlotProps>(), {
  progress: 0.33,
})

const isOpen = ref(false)

function toggle() {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="reliquary-slot" :class="{ 'is-open': isOpen }">
    <!-- Header row -->
    <div
      class="slot-header"
      role="button"
      :aria-expanded="isOpen"
      tabindex="0"
      @click="toggle"
      @keydown.enter.prevent="toggle"
      @keydown.space.prevent="toggle"
    >
      <div class="slot-header-left">
        <Icon :name="icon" class="slot-icon" aria-hidden="true" />
        <h3 class="slot-title">{{ title }}</h3>
      </div>
      <Icon
        :name="isOpen ? 'material-symbols:remove' : 'material-symbols:add'"
        class="slot-toggle-icon"
        aria-hidden="true"
      />
    </div>

    <!-- Collapsed progress bar -->
    <div v-if="!isOpen" class="slot-progress-track" aria-hidden="true">
      <div class="slot-progress-fill" :style="{ width: `${progress * 100}%` }" />
    </div>

    <!-- Open gradient divider -->
    <div v-if="isOpen" class="slot-open-divider" aria-hidden="true" />

    <!-- Expandable content (slot for arbitrary lore/content) -->
    <Transition name="slot-expand">
      <div v-if="isOpen" class="slot-body">
        <slot>
          <!-- Default placeholder lore text -->
          <p class="slot-lore">
            <em>The foundation of all modern arcana. Within these pages lies the mathematical proof for the crystallization of grace.</em>
          </p>
          <div class="slot-tags">
            <span class="slot-tag">ARTIFACT_ID: #8892</span>
            <span class="slot-tag">RARITY: LEGENDARY</span>
          </div>
        </slot>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* ─── Design tokens (mirrors DESIGN.md) ───────────────────────── */
:root {
  --color-surface-low:      #1b1b1d;
  --color-surface:          #131315;
  --color-primary:          #f1c97d;
  --color-primary-dim:      #d4ad65;
  --color-stone-400:        #a8a29e;
  --color-stone-500:        #78716c;
  --color-stone-600:        #57534e;
  --color-stone-800:        #292524;
  --color-stone-900:        #1c1917;
  --rune-gradient:          linear-gradient(135deg, #f1c97d 0%, #d4ad65 100%);
  --glass-bg:               rgba(19, 19, 21, 0.6);
  --glass-border:           rgba(241, 201, 125, 0.1);
  --glass-blur:             blur(20px);
  --gold-glow:              0 0 20px rgba(241, 201, 125, 0.15);
}

/* ─── Slot wrapper ─────────────────────────────────────────────── */
.reliquary-slot {
  font-family: 'Manrope', sans-serif;
  border-left: 2px solid transparent;
  transition: border-color 0.2s ease;
}

.reliquary-slot:hover:not(.is-open) {
  border-left-color: rgba(241, 201, 125, 0.5);
}

.reliquary-slot.is-open {
  border: 1px solid rgba(241, 201, 125, 0.2);
  border-left-width: 1px; /* override left-2 so full border takes over */
}

/* ─── Header ───────────────────────────────────────────────────── */
.slot-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background-color: var(--color-surface-low);
  cursor: pointer;
  transition: background-color 0.2s ease;
  user-select: none;
  outline: none;
}

.is-open .slot-header {
  background-color: rgba(241, 201, 125, 0.1);
}

.slot-header:focus-visible {
  outline: 1px solid var(--color-primary);
  outline-offset: -1px;
}

.slot-header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* ─── Icon ─────────────────────────────────────────────────────── */
.slot-icon {
  font-size: 1.25rem;
  color: var(--color-stone-500);
  transition: color 0.2s ease;
}

.reliquary-slot:hover .slot-icon,
.is-open .slot-icon {
  color: var(--color-primary);
}

.slot-toggle-icon {
  font-size: 1.25rem;
  color: var(--color-stone-600);
  transition: color 0.2s ease;
}

.is-open .slot-toggle-icon {
  color: var(--color-primary);
}

/* ─── Title ────────────────────────────────────────────────────── */
.slot-title {
  margin: 0;
  font-family: 'Noto Serif', serif;
  font-style: italic;
  font-size: 1.125rem;
  font-weight: 400;
  color: var(--color-stone-400);
  transition: color 0.2s ease;
}

.reliquary-slot:hover .slot-title,
.is-open .slot-title {
  color: var(--color-primary);
}

/* ─── Collapsed progress bar ("Reliquary Slot" metaphor) ───────── */
.slot-progress-track {
  height: 1px;
  width: 100%;
  background-color: rgba(41, 37, 36, 0.5); /* stone-800/50 */
  position: relative;
  overflow: hidden;
}

.slot-progress-fill {
  position: absolute;
  inset-block: 0;
  left: 0;
  background: var(--rune-gradient);
  opacity: 0.5;
  transition: width 0.6s ease;
}

/* ─── Open gradient divider ────────────────────────────────────── */
.slot-open-divider {
  height: 1px;
  width: 100%;
  background: var(--rune-gradient);
}

/* ─── Body / content panel ─────────────────────────────────────── */
.slot-body {
  padding: 1.5rem;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  box-shadow: var(--gold-glow);
}

/* ─── Default slot content ─────────────────────────────────────── */
.slot-lore {
  font-family: 'Lora', serif;
  font-size: 0.9375rem;
  color: #d6d3d1; /* stone-300 */
  line-height: 1.75;
  margin: 0 0 1rem;
}

.slot-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.slot-tag {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.625rem; /* 10px */
  letter-spacing: 0.2em;
  text-transform: uppercase;
  padding: 0.25rem 0.5rem;
  background-color: var(--color-stone-800);
  color: var(--color-stone-400);
}

/* ─── Expand/collapse transition ───────────────────────────────── */
.slot-expand-enter-active,
.slot-expand-leave-active {
  transition: max-height 0.35s ease, opacity 0.25s ease;
  overflow: hidden;
  max-height: 400px;
}

.slot-expand-enter-from,
.slot-expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
