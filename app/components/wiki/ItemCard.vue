<script setup lang="ts">
import { useWikiStore } from '~/stores/useWikiStore'
import WikiItemModal from './WikiItemModal.vue'

interface Item {
  id: string
  name: string
}

const props = defineProps<{
  item: Item
  category: string
}>()

const wikiStore = useWikiStore()
const cardRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)
const isModalOpen = ref(false)

const apiInfo = computed(() => {
  if (!props.category || !props.item?.name) return null
  return wikiStore.getCachedItem(props.category, props.item.name)
})

const isPending = computed(() => {
  if (!props.category || !props.item?.name) return false
  return wikiStore.isItemLoading(props.category, props.item.name)
})

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!cardRef.value) return
  observer = new IntersectionObserver((entries) => {
    if (entries?.[0]?.isIntersecting) {
      isVisible.value = true
      if (props.category && props.item?.name) {
        wikiStore.fetchItemDetails(props.category, props.item.name)
      }
      observer?.disconnect()
      observer = null
    }
  }, { rootMargin: '200px', threshold: 0.01 })
  observer.observe(cardRef.value)
})

onUnmounted(() => {
  observer?.disconnect()
})

function openWikiModal() {
  if (props.category && props.item?.name) {
    if (!apiInfo.value) {
      wikiStore.fetchItemDetails(props.category, props.item.name)
    }
    isModalOpen.value = true
  }
}
</script>

<template>
  <div
    ref="cardRef"
    class="wiki-item-card glass-panel"
    tabindex="0"
    role="button"
    @click="openWikiModal"
    @keydown.enter="openWikiModal"
    @keydown.space.prevent="openWikiModal"
  >
    <div class="wiki-item-card__image-wrap">
      <NuxtImg
        v-if="apiInfo?.image"
        :src="apiInfo.image"
        :alt="item.name"
        class="wiki-item-card__image"
        loading="lazy"
      />
      <div v-else-if="isPending" class="wiki-item-card__loader" />
      <Icon
        v-else
        name="material-symbols:image-outline"
        size="32"
        class="wiki-item-card__placeholder"
      />
    </div>

    <div class="wiki-item-card__info">
      <h4 class="wiki-item-card__name">{{ item.name }}</h4>
      <p v-if="apiInfo?.description" class="wiki-item-card__desc">
        {{ apiInfo.description }}
      </p>
    </div>

    <WikiItemModal
      v-if="isModalOpen"
      :category="category"
      :item-name="item.name"
      @close="isModalOpen = false"
    />
  </div>
</template>

<style scoped lang="scss">
.wiki-item-card {
  cursor: pointer;
  border-radius: $radius-sm;
  border: 1px solid rgba($color-outline, 0.2);
  overflow: hidden;
  transition: border-color $transition-base, box-shadow $transition-base;
  display: flex;
  flex-direction: column;

  &:hover {
    border-color: rgba($color-primary, 0.4);
    box-shadow: 0 0 20px rgba($color-primary, 0.1);

    .wiki-item-card__image {
      transform: scale(1.05);
    }

    .wiki-item-card__name {
      color: $color-primary;
    }
  }

  &__image-wrap {
    width: 100%;
    aspect-ratio: 1;
    background: rgba($color-surface-lowest, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-bottom: 1px solid rgba($color-outline, 0.1);
    transition: border-color $transition-base;

    .wiki-item-card:hover & {
      border-color: rgba($color-primary, 0.2);
    }
  }

  &__image {
    width: 85%;
    height: 85%;
    object-fit: contain;
    transition: transform $transition-slow;
    filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.5));
  }

  &__loader {
    width: 1.5rem;
    height: 1.5rem;
    border: 2px solid rgba($color-primary, 0.1);
    border-top-color: $color-primary;
    border-radius: 50%;
    animation: wiki-spin 1s linear infinite;
  }

  &__placeholder {
    opacity: 0.2;
    color: $color-primary;
  }

  &__info {
    padding: $space-4;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: $space-2;
  }

  &__name {
    font-family: $font-headline;
    font-size: 1.125rem;
    font-weight: 700;
    color: $color-on-surface;
    transition: color $transition-base;
    margin: 0;
  }

  &__desc {
    font-family: $font-lora;
    font-style: italic;
    font-size: $text-lore;
    line-height: 1.6;
    color: rgba($color-on-surface, 0.7);
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

@keyframes wiki-spin {
  to { transform: rotate(360deg); }
}
</style>
