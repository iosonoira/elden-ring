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
