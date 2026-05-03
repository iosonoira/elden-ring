<script setup lang="ts">
definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'Elden Ring Automatic Checklist — Gilded Reliquary',
  description: 'Upload your .sl2 save file to instantly cross-reference your progress against the vast treasures of the Lands Between.',
})

// ── State ─────────────────────────────────────────────────────────────────────
const activeTab = ref<'missing' | 'owned'>('missing')
const isDragging = ref(false)

// ── Inventory categories (placeholder data) ────────────────────────────────────
interface Category {
  icon: string
  title: string
  lore: string
  owned: number
  total: number
}

const categories: Category[] = [
  { icon: 'swords', title: 'Weapons', lore: 'Hand-held instruments of destruction', owned: 178, total: 377 },
  { icon: 'shield_person', title: 'Armor', lore: 'Tarnished steel and royal silk', owned: 50, total: 100 },
  { icon: 'brightness_7', title: 'Talismans', lore: 'Sacred trinkets blessed by the Erdtree', owned: 32, total: 84 },
]

// ── Upload zone handlers ───────────────────────────────────────────────────────
function handleDragOver(e: DragEvent) {
  e.preventDefault()
  isDragging.value = true
}

function handleDragLeave() {
  isDragging.value = false
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) {
    // placeholder — real parsing logic goes here
    if (import.meta.dev) console.log('[checklist] dropped file:', file.name)
  }
}

function handleFileInput(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file && import.meta.dev) console.log('[checklist] selected file:', file.name)
}
</script>

<template>
  <div class="checklist-page">
    <!-- ── Hero Header ──────────────────────────────────────────────────────── -->
    <section class="checklist-page__hero">
      <h1 class="checklist-page__hero-title grace-glow">
        Elden Ring Automatic Checklist
      </h1>
      <div class="checklist-page__hero-lede">
        <p class="checklist-page__hero-body">
          Ascend to your throne with absolute clarity. Upload your
          <span class="checklist-page__hero-highlight">.sl2 save file</span>
          to instantly cross-reference your progress against the vast treasures of the Lands Between.
        </p>
      </div>
    </section>

    <!-- ── Upload Zone ──────────────────────────────────────────────────────── -->
    <section class="checklist-page__upload">
      <label
        class="upload-zone"
        :class="{ 'upload-zone--dragging': isDragging }"
        for="save-file-input"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
        @drop="handleDrop"
      >
        <div class="upload-zone__glow" />
        <span class="material-symbols-outlined upload-zone__icon grace-glow">upload_file</span>
        <div class="upload-zone__copy">
          <p class="upload-zone__cta">Drop your .sl2 save file here</p>
          <p class="upload-zone__disclaimer">Local analysis · No data leaves your machine</p>
        </div>
        <input
          id="save-file-input"
          type="file"
          accept=".sl2"
          class="upload-zone__input"
          @change="handleFileInput"
        >
      </label>
    </section>

    <!-- ── Tabs ─────────────────────────────────────────────────────────────── -->
    <div class="checklist-page__tabs">
      <button
        class="checklist-tab"
        :class="{ 'checklist-tab--active': activeTab === 'missing' }"
        @click="activeTab = 'missing'"
      >
        <span class="checklist-tab__label">Missing Items</span>
        <div class="checklist-tab__bar" />
      </button>
      <button
        class="checklist-tab"
        :class="{ 'checklist-tab--active': activeTab === 'owned' }"
        @click="activeTab = 'owned'"
      >
        <span class="checklist-tab__label">Owned Items</span>
        <div class="checklist-tab__bar" />
      </button>
    </div>

    <!-- ── Inventory Accordions ──────────────────────────────────────────────── -->
    <section class="checklist-page__inventory" aria-label="Inventory categories">
      <WikiReliquarySlot
        v-for="cat in categories"
        :key="cat.title"
        :icon="cat.icon"
        :title="cat.title"
        :lore="cat.lore"
        :owned="cat.owned"
        :total="cat.total"
      />
    </section>

    <!-- ── Archive Wisdom (asymmetric detail section) ─────────────────────── -->
    <section class="checklist-page__wisdom">
      <div class="wisdom-copy">
        <h2 class="wisdom-copy__title">The Archive's Wisdom</h2>
        <div class="wisdom-copy__rule" />
        <p class="wisdom-copy__body">
          Every item in your inventory is a fragment of history. The Archive doesn't just track
          your items; it maps your legend across the fog-shrouded history of the Lands Between.
          Ensure no stone remains unturned, and no boss remains unchallenged.
        </p>
        <div class="wisdom-copy__actions">
          <button class="wisdom-btn wisdom-btn--ghost">Export Report</button>
          <button class="wisdom-btn wisdom-btn--muted">View Map Locations</button>
        </div>
      </div>

      <div class="wisdom-image">
        <NuxtImg
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUr7ncY3_6Epoji5sXUuXY-QBOaQTxxcdwuIDLhZ5QUc6kFrJn-JsUwlGn2wdE2Ks9xttgaNqH0b9J9WisLUWOlApS6CJkjZY0lerk3K2YhqX1Op1KXe-pdF5__r5BhD9AxiPaWgyPpmWsYa1AS51fYyFBifOdSCOEHBsx_agqaKKojwXXPsVPmwKR7IeIXFYMwJpLnluzyPPks1ks36cs6_yk7PfSn4n1aAeJa0Kc_T9tsuNem2eWWwoVXy1tIWKjXgU8kJkj8uM"
          alt="Atmospheric dark fantasy architectural landscape — Restored Archives"
          format="webp"
          width="600"
          height="400"
          class="wisdom-image__img"
        />
        <div class="wisdom-image__overlay" />
        <span class="wisdom-image__caption">Restored Archives</span>
      </div>
    </section>

    <!-- ── Footer ──────────────────────────────────────────────────────────── -->
    <footer class="checklist-footer">
      <div class="checklist-footer__divider" />
      <p class="checklist-footer__motto">May Grace Guide Thee</p>
    </footer>
  </div>
</template>

