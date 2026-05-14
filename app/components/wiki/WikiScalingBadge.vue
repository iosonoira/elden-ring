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
