<script setup lang="ts">
defineProps<{ drops: string[] }>()
</script>

<template>
  <ul class="wiki-drop-list">
    <li v-for="(drop, index) in drops" :key="`${index}-${drop}`" class="wiki-drop-list__item">
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
