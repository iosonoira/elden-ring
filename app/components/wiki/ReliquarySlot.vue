<script setup lang="ts">
// Reliquary Slot Accordion per categoria inventario
interface Props {
  icon: string
  title: string
  lore: string
  owned: number
  total: number
}

const props = defineProps<Props>()

const isOpen = ref(false)

const progress = computed(() => Math.round((props.owned / props.total) * 100))

function toggle() {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="reliquary-slot" :class="{ 'reliquary-slot--open': isOpen }">
    <!-- Accordion Header -->
    <div
      class="reliquary-slot__header"
      role="button"
      :tabindex="0"
      :aria-expanded="isOpen"
      :aria-label="`${title} — ${owned} of ${total} collected`"
      @click="toggle"
      @keydown.enter="toggle"
      @keydown.space.prevent="toggle"
    >
      <div class="reliquary-slot__info">
        <span class="material-symbols-outlined reliquary-slot__icon">{{ icon }}</span>
        <div class="reliquary-slot__text">
          <h3 class="reliquary-slot__title">{{ title }}</h3>
          <p class="reliquary-slot__lore">{{ lore }}</p>
        </div>
      </div>

      <div class="reliquary-slot__meta">
        <div class="reliquary-slot__count">
          <span class="reliquary-slot__count-label">Completion</span>
          <span class="reliquary-slot__count-value">{{ owned }} / {{ total }}</span>
        </div>
        <span
          class="material-symbols-outlined reliquary-slot__chevron"
          aria-hidden="true"
        >
          expand_more
        </span>
      </div>
    </div>

    <!-- Progress Line (1px, Rune Gradient) -->
    <div class="reliquary-slot__progress-track">
      <div
        class="reliquary-slot__progress-fill"
        :style="{ width: `${progress}%` }"
      />
    </div>

    <!-- Expanded content slot -->
    <Transition name="slot-expand">
      <div v-if="isOpen" class="reliquary-slot__body">
        <slot>
          <p class="reliquary-slot__empty">
            Upload your <em>.sl2</em> save file to populate this category.
          </p>
        </slot>
      </div>
    </Transition>
  </div>
</template>

