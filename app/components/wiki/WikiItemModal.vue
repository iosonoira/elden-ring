<script setup lang="ts">
import { useWikiStore } from '~/stores/useWikiStore'

interface Props {
  category: string
  itemName: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const localePath = useLocalePath()
const { t } = useI18n()
const wikiStore = useWikiStore()

const item = computed(() => wikiStore.getCachedItem(props.category, props.itemName))
const isLoading = computed(() => wikiStore.isItemLoading(props.category, props.itemName))
const categoryLabel = computed(() => t(`wiki.category.${props.category}`))

let previousOverflow = ''

const closeButtonRef = ref<HTMLButtonElement | null>(null)

const close = () => emit('close')

const viewFullPage = () => {
  if (item.value?.id) {
    navigateTo(localePath(`/wiki/${props.category}/${item.value.id}`))
    emit('close')
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') close()
}

onMounted(() => {
  wikiStore.fetchItemDetails(props.category, props.itemName)
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  document.addEventListener('keydown', handleKeydown)
  nextTick(() => closeButtonRef.value?.focus())
})

onUnmounted(() => {
  document.body.style.overflow = previousOverflow
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div
      class="wiki-modal-overlay"
      @click.self="close"
      tabindex="-1"
    >
      <div
        class="wiki-modal glass-panel"
        role="dialog"
        aria-modal="true"
        :aria-label="item?.name ?? categoryLabel"
      >
        <button
          ref="closeButtonRef"
          class="wiki-modal__close"
          @click="close"
          :aria-label="$t('wiki.modal.close')"
        >
          <Icon name="material-symbols:close" size="24" />
        </button>

        <div v-if="isLoading" class="wiki-modal__loading">
          <div class="wiki-modal__loader" />
        </div>

        <div v-else-if="item" class="wiki-modal__content">
          <div class="wiki-modal__image-wrap">
            <NuxtImg
              v-if="item.image"
              :src="item.image"
              :alt="item.name"
              class="wiki-modal__image"
            />
            <Icon
              v-else
              name="material-symbols:image-outline"
              size="48"
              class="wiki-modal__image-placeholder"
            />
          </div>

          <div class="wiki-modal__header">
            <p class="wiki-modal__category">{{ categoryLabel }}</p>
            <h2 class="wiki-modal__title">{{ item.name }}</h2>
          </div>

          <div class="wiki-modal__divider" />

          <p v-if="item.description" class="wiki-modal__description">
            {{ item.description }}
          </p>

          <div v-if="item.location || item.weight || item.quote" class="wiki-modal__meta">
            <div v-if="item.location" class="wiki-modal__meta-row">
              <span class="wiki-modal__meta-label">{{ $t('wiki.label.location') }}</span>
              <span class="wiki-modal__meta-value">{{ item.location }}</span>
            </div>
            <div v-if="item.weight" class="wiki-modal__meta-row">
              <span class="wiki-modal__meta-label">{{ $t('wiki.label.weight') }}</span>
              <span class="wiki-modal__meta-value">{{ item.weight }}</span>
            </div>
            <div v-if="item.quote" class="wiki-modal__meta-row">
              <span class="wiki-modal__meta-label">{{ $t('wiki.label.quote') }}</span>
              <span class="wiki-modal__meta-value wiki-modal__meta-value--quote">{{ item.quote }}</span>
            </div>
          </div>

          <div class="wiki-modal__footer">
            <button class="wiki-modal__cta" @click="viewFullPage">
              {{ $t('wiki.modal.viewFull') }}
              <Icon name="material-symbols:arrow-forward" size="18" />
            </button>
          </div>
        </div>

        <div v-else class="wiki-modal__empty">
          <Icon name="material-symbols:error-outline" size="32" />
          <p>{{ $t('wiki.error.message') }}</p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.wiki-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: $space-4;
}

.wiki-modal {
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  border-radius: $radius-md;

  // Rune top accent via pseudo-element (border-image conflicts with border-radius)
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 10%;
    right: 10%;
    height: 1px;
    background: linear-gradient(to right, transparent, $color-primary, transparent);
  }

  &__close {
    position: absolute;
    top: $space-4;
    right: $space-4;
    background: none;
    border: none;
    color: rgba($color-on-surface, 0.5);
    cursor: pointer;
    padding: $space-2;
    transition: color $transition-fast;
    z-index: 1;

    &:hover {
      color: $color-on-surface;
    }
  }

  &__loading {
    display: flex;
    justify-content: center;
    padding: $space-12;
  }

  &__loader {
    width: 40px;
    height: 40px;
    border: 2px solid rgba($color-primary, 0.1);
    border-top-color: $color-primary;
    border-radius: 50%;
    animation: modal-spin 1s linear infinite;
  }

  &__content {
    padding: $space-8;
    display: flex;
    flex-direction: column;
    gap: $space-6;
  }

  &__image-wrap {
    width: 280px;
    height: 280px;
    margin: 0 auto;
    background: rgba($color-surface-lowest, 0.6);
    border: 1px solid rgba($color-outline, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  &__image {
    width: 85%;
    height: 85%;
    object-fit: contain;
    filter: drop-shadow(0 0 16px rgba(0, 0, 0, 0.6));
  }

  &__image-placeholder {
    opacity: 0.2;
    color: $color-primary;
  }

  &__header {
    text-align: center;
  }

  &__category {
    font-family: $font-label;
    font-size: $text-label;
    text-transform: uppercase;
    letter-spacing: 0.5em;
    color: $color-primary;
    opacity: 0.7;
    margin: 0 0 $space-2;
  }

  &__title {
    font-family: $font-cinzel;
    font-size: 1.75rem;
    font-weight: 700;
    text-transform: uppercase;
    color: $color-primary;
    margin: 0;
    line-height: 1.2;
  }

  &__divider {
    height: 1px;
    background: linear-gradient(to right, transparent, rgba($color-primary, 0.4), transparent);
  }

  &__description {
    font-family: $font-lora;
    font-style: italic;
    font-size: $text-lore;
    line-height: 1.7;
    color: rgba($color-on-surface, 0.85);
    margin: 0;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: $space-4;
  }

  &__meta-row {
    display: flex;
    flex-direction: column;
    gap: $space-1;
  }

  &__meta-label {
    font-family: $font-label;
    font-size: $text-label;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    color: rgba($color-on-surface, 0.4);
  }

  &__meta-value {
    font-family: $font-body;
    font-size: $text-body;
    color: $color-on-surface;

    &--quote {
      font-family: $font-lora;
      font-style: italic;
    }
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: $space-4;
    padding: $space-12;
    color: rgba($color-on-surface, 0.4);
    text-align: center;
  }

  &__footer {
    display: flex;
    justify-content: center;
    padding-top: $space-2;
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    padding: $space-3 $space-6;
    border: 1px solid rgba($color-primary, 0.3);
    background: rgba($color-primary, 0.08);
    color: $color-primary;
    font-family: $font-label;
    font-size: $text-label;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    cursor: pointer;
    transition: background $transition-base, border-color $transition-base;
    border-radius: $radius-sm;

    &:hover {
      background: rgba($color-primary, 0.12);
      border-color: rgba($color-primary, 0.5);
    }
  }
}

@keyframes modal-spin {
  to { transform: rotate(360deg); }
}
</style>
