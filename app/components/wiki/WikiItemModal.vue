<script setup lang="ts">
import { useWikiStore } from '~/stores/useWikiStore'

interface Props {
  category: string
  itemName: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  navigate: [category: string, id: string]
}>()

const localePath = useLocalePath()
const wikiStore = useWikiStore()

const item = computed(() => wikiStore.getCachedItem(props.category, props.itemName))
const isLoading = computed(() => wikiStore.isItemLoading(props.category, props.itemName))

const close = () => emit('close')

const viewFullPage = () => {
  if (item.value) {
    navigateTo(localePath(`/wiki/${props.category}/${item.value.id || props.itemName}`))
    emit('close')
  }
}

onMounted(() => {
  wikiStore.fetchItemDetails(props.category, props.itemName)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.body.style.overflow = ''
})

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') close()
}
</script>

<template>
  <Teleport to="body">
    <div class="wiki-modal-overlay" @click.self="close" @keydown="handleKeydown" tabindex="-1">
      <div class="wiki-modal glass-panel" role="dialog" aria-modal="true">
        <button class="wiki-modal__close" @click="close" :aria-label="$t('wiki.modal.close')">
          <Icon name="material-symbols:close" size="24" />
        </button>

        <div v-if="isLoading" class="wiki-modal__loading">
          <div class="wiki-modal__loader"></div>
        </div>

        <div v-else-if="item" class="wiki-modal__content">
          <div class="wiki-modal__image-container">
            <NuxtImg v-if="item.image" :src="item.image" :alt="item.name" class="wiki-modal__image" />
          </div>
          
          <h2 class="wiki-modal__title">{{ item.name }}</h2>
          
          <p v-if="item.description" class="wiki-modal__description lore-text italic">
            {{ item.description }}
          </p>
          
          <div v-if="item.location" class="wiki-modal__meta">
            <span class="wiki-modal__meta-label">{{ $t('wiki.label.location') }}</span>
            <span class="wiki-modal__meta-value">{{ item.location }}</span>
          </div>

          <button class="wiki-modal__button" @click="viewFullPage">
            {{ $t('wiki.modal.viewFull') }}
            <Icon name="material-symbols:arrow-forward" size="18" />
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.wiki-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}
.wiki-modal {
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 2rem;
}
.wiki-modal__close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.5rem;
}
.wiki-modal__close:hover {
  color: var(--text);
}
.wiki-modal__loading {
  display: flex;
  justify-content: center;
  padding: 3rem;
}
.wiki-modal__loader {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.wiki-modal__image-container {
  text-align: center;
  margin-bottom: 1.5rem;
}
.wiki-modal__image {
  max-width: 200px;
  max-height: 200px;
  object-fit: contain;
}
.wiki-modal__title {
  font-size: 1.5rem;
  margin: 0 0 1rem;
}
.wiki-modal__description {
  margin-bottom: 1.5rem;
}
.wiki-modal__meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1.5rem;
}
.wiki-modal__meta-label {
  color: var(--text-muted);
  font-size: 0.875rem;
}
.wiki-modal__meta-value {
  font-weight: 500;
}
.wiki-modal__button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--accent);
  color: var(--bg);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}
.wiki-modal__button:hover {
  transform: translateY(-2px);
}
</style>