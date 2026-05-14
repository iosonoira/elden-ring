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
