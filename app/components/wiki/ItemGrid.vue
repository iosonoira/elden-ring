<script setup lang="ts">
interface Item {
  id: string
  name: string
  image?: string
}

const props = defineProps<{
  items: Item[]
  category: string
}>()

function getItemDelay(index: number) {
  return `${index * 50}ms`
}
</script>

<template>
  <TransitionGroup tag="div" name="item-grid" class="item-grid">
    <LazyWikiItemCard 
      v-for="(item, index) in items" 
      :key="item.id" 
      :item="item"
      :category="category"
      :style="{ '--delay': getItemDelay(index) }"
    />
  </TransitionGroup>
</template>


