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

function getWikiUrl(name: string) {
  return `https://eldenring.wiki.fextralife.com/${name.replace(/ \+\d+$/, '').replaceAll(' ', '+')}`
}
</script>

<template>
  <div class="item-grid">
    <LazyWikiItemCard 
      v-for="item in items" 
      :key="item.id" 
      :item="item"
      :category="category"
    />
  </div>
</template>


