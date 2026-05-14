<script setup lang="ts">
import { useSaveStore } from '~/stores/useSaveStore'

definePageMeta({ layout: 'default' })

const store = useSaveStore()

const { stats, globalStats, selectedCharacterIndex, isLoaded, ownedItems, missingItems } = storeToRefs(store)

useSeoMeta({
  title: 'Elden Ring Automatic Checklist — Gilded Reliquary',
  description: 'Upload your .sl2 save file to instantly cross-reference your progress against the vast treasures of the Lands Between.',
})

// ── State ─────────────────────────────────────────────────────────────────────
const activeTab = ref<'missing' | 'owned'>('owned')
const isDragging = ref(false)

type CategoryKey = 'armament' | 'armor' | 'talisman' | 'magic' | 'ashesOfWar' | 'spiritAshes'

// ── Categories Mapping ────────────────────────────────────────────────────────
const categories = computed(() => {
  const s = stats.value
  if (!s) return []
  
  const cats: { key: CategoryKey, icon: string, title: string, lore: string, owned: number, total: number }[] = [
    { 
      key: 'armament',
      icon: 'swords', 
      title: 'Weapons', 
      lore: 'Hand-held instruments of destruction', 
      owned: s?.armament?.owned || 0, 
      total: s?.armament?.total || 0 
    },
    { 
      key: 'armor',
      icon: 'shield-person', 
      title: 'Armor', 
      lore: 'Tarnished steel and royal silk', 
      owned: s?.armor?.owned || 0, 
      total: s?.armor?.total || 0 
    },
    { 
      key: 'talisman',
      icon: 'brightness-7', 
      title: 'Talismans', 
      lore: 'Sacred trinkets blessed by the Erdtree', 
      owned: s?.talisman?.owned || 0, 
      total: s?.talisman?.total || 0 
    },
    { 
      key: 'magic',
      icon: 'auto-awesome', 
      title: 'Magic', 
      lore: 'Spells and incantations of the primeval current', 
      owned: s?.magic?.owned || 0, 
      total: s?.magic?.total || 0 
    },
    { 
      key: 'ashesOfWar',
      icon: 'settings',
      title: 'Ashes of War', 
      lore: 'Techniques of legendary warriors', 
      owned: s?.ashesOfWar?.owned || 0, 
      total: s?.ashesOfWar?.total || 0 
    },
    { 
      key: 'spiritAshes',
      icon: 'person-outline', 
      title: 'Spirit Ashes', 
      lore: 'Spectral remains of fallen combatants', 
      owned: s?.spiritAshes?.owned || 0, 
      total: s?.spiritAshes?.total || 0 
    },
  ]
  return cats
})

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
    store.handleFileUpload(file)
  }
}

function handleFileInput(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    store.handleFileUpload(file)
  }
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
      <ClientOnly>
        <template v-if="store.isLoaded">
          <div class="upload-zone upload-zone--loaded">
            <div class="upload-zone__glow" />
            <Icon name="material-symbols:check-circle-outline" class="upload-zone__icon grace-glow" size="48" />
            <div class="upload-zone__copy">
              <p class="upload-zone__cta">Save file loaded</p>
              <p class="upload-zone__disclaimer">
                <button class="upload-zone__reset" @click="store.resetSave()">
                  Change file
                </button>
              </p>
            </div>
          </div>
          <WikiCharacterSelector />
        </template>

        <label v-else class="upload-zone" :class="{ 'upload-zone--dragging': isDragging }"
          for="save-file-input"
          @dragover="handleDragOver" @dragleave="handleDragLeave" @drop="handleDrop">
          <div class="upload-zone__glow" />
          <Icon name="material-symbols:upload-file-outline" class="upload-zone__icon grace-glow" size="48" />
          <div class="upload-zone__copy">
            <p class="upload-zone__cta">Drop your .sl2 save file here</p>
            <p class="upload-zone__disclaimer">Local analysis · No data leaves your machine</p>
          </div>
          <input id="save-file-input" type="file" accept=".sl2" class="upload-zone__input" @change="handleFileInput">
        </label>
      </ClientOnly>
    </section>

    <!-- ── Tabs ─────────────────────────────────────────────────────────────── -->
    <ClientOnly>
    <div v-if="selectedCharacterIndex !== null" class="checklist-page__tabs">
      <button class="checklist-tab" :class="{ 'checklist-tab--active': activeTab === 'owned' }"
        @click="activeTab = 'owned'">
        <span class="checklist-tab__label">
          Owned Items
          <span v-if="globalStats" class="checklist-tab__count">({{ globalStats.owned }})</span>
        </span>
        <div class="checklist-tab__bar" />
      </button>
      <button class="checklist-tab" :class="{ 'checklist-tab--active': activeTab === 'missing' }"
        @click="activeTab = 'missing'">
        <span class="checklist-tab__label">
          Missing Items
          <span v-if="globalStats" class="checklist-tab__count">({{ globalStats.total - globalStats.owned }})</span>
        </span>
        <div class="checklist-tab__bar" />
      </button>
    </div>
    </ClientOnly>

<!-- ── Inventory Accordions ──────────────────────────────────────────────── -->
    <ClientOnly>
    <section v-if="selectedCharacterIndex !== null" class="checklist-page__inventory" aria-label="Inventory categories">
      <WikiReliquarySlot 
        v-for="cat in categories" 
        :key="cat.key"
        :icon="cat.icon"
        :title="cat.title"
        :lore="cat.lore"
        :owned="activeTab === 'missing' ? (cat.total - cat.owned) : cat.owned" 
        :total="cat.total"
        :label="activeTab === 'missing' ? 'Missing' : 'Owned'"
        :reset-key="activeTab"
      >
        <WikiItemGrid 
          v-if="cat.key"
          :items="activeTab === 'missing' ? (missingItems?.[cat.key] || []) : (ownedItems?.[cat.key] || [])" 
          :category="cat.key" 
        />
      </WikiReliquarySlot>
    </section>
    </ClientOnly>

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
      </div>

      <div class="wisdom-image">
        <NuxtImg
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUr7ncY3_6Epoji5sXUuXY-QBOaQTxxcdwuIDLhZ5QUc6kFrJn-JsUwlGn2wdE2Ks9xttgaNqH0b9J9WisLUWOlApS6CJkjZY0lerk3K2YhqX1Op1KXe-pdF5__r5BhD9AxiPaWgyPpmWsYa1AS51fYyFBifOdSCOEHBsx_agqaKKojwXXPsVPmwKR7IeIXFYMwJpLnluzyPPks1ks36cs6_yk7PfSn4n1aAeJa0Kc_T9tsuNem2eWWwoVXy1tIWKjXgU8kJkj8uM"
          alt="Atmospheric dark fantasy architectural landscape — Restored Archives" format="webp" width="600"
          height="400" class="wisdom-image__img" />
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
