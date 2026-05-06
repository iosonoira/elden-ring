<script setup lang="ts">
// Reliquary Slot Accordion per categoria inventario
interface Props {
  icon: string
  title: string
  lore: string
  owned: number
  total: number
  label?: string
}

const props = defineProps<Props>()

const isOpen = ref(false)

const progress = computed(() => {
  if (props.total === 0) return 0;
  // If label is "Missing", we calculate based on the REMAINING items.
  // Wait, actually, the Index passes the "result" of the subtraction to 'owned' prop if missing.
  // So 'owned' becomes 'count' in this context.
  return Math.round((props.owned / props.total) * 100)
})

function toggle() {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="reliquary-slot" :class="{ 'reliquary-slot--open': isOpen }">
    <!-- Accordion Header -->
    <div class="reliquary-slot__header" role="button" :tabindex="0" :aria-expanded="isOpen"
      :aria-label="`${title} — ${owned} of ${total} ${label || 'collected'}`" @click="toggle" @keydown.enter="toggle"
      @keydown.space.prevent="toggle">
      <div class="reliquary-slot__info">
        <Icon :name="`material-symbols:${icon.replace(/_/g, '-')}`" class="reliquary-slot__icon" size="24" />
        <div class="reliquary-slot__text">
          <h3 class="reliquary-slot__title">{{ title }}</h3>
          <p class="reliquary-slot__lore">{{ lore }}</p>
        </div>
      </div>

      <div class="reliquary-slot__meta">
        <div class="reliquary-slot__count">
          <span class="reliquary-slot__count-label">{{ label || 'Completion' }}</span>
          <span class="reliquary-slot__count-value">{{ owned }} / {{ total }}</span>
        </div>
        <Icon
          name="material-symbols:expand-more"
          class="reliquary-slot__chevron"
          aria-hidden="true"
          size="20"
        />
      </div>
    </div>

    <!-- Progress Line (1px, Rune Gradient) -->
    <div class="reliquary-slot__progress-track">
      <div class="reliquary-slot__progress-fill" :style="{ width: `${progress}%` }" />
    </div>

    <!-- Expanded content slot -->
    <div class="reliquary-slot__body-wrapper" :class="{ 'reliquary-slot__body-wrapper--open': isOpen }">
      <div v-show="isOpen" class="reliquary-slot__body">
        <slot>
          <p class="reliquary-slot__empty">
            Upload your <em>.sl2</em> save file to populate this category.
          </p>
        </slot>
      </div>
    </div>
  </div>
</template>
