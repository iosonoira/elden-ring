<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { WikiCategory } from '~/shared/types/EldenRingApi'

definePageMeta({ layout: 'default' })

const route = useRoute()
const { t } = useI18n()

const category = route.params.category as string
const id = route.params.id as string

const { item, pending, error } = useWikiItem(category as WikiCategory, id)

useSeoMeta({
  title: computed(() => item.value?.name ? `${item.value.name} | Gilded Reliquary` : t('wiki.page.titleFallback')),
  description: computed(() => item.value?.description || t('wiki.page.descFallback'))
})
</script>

<template>
  <div class="wiki-page">
    <!-- Pending State -->
    <div v-if="pending" class="wiki-page__skeleton">
      <div class="wiki-page__skeleton-img"></div>
      <div class="wiki-page__skeleton-info">
         <div class="wiki-page__skeleton-text wiki-page__skeleton-text--hero"></div>
         <div class="wiki-page__skeleton-text"></div>
         <div class="wiki-page__skeleton-text"></div>
      </div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="wiki-page__error">
      <h2 class="error-title">{{ $t('wiki.error.title') }}</h2>
      <p class="error-message">{{ $t('wiki.error.message') }}</p>
    </div>

    <!-- Data Loaded State -->
    <div v-else-if="item" class="wiki-page__content">
      <header class="wiki-page__header">
        <h1 class="wiki-page__title">{{ item.name }}</h1>
        <p class="wiki-page__type">{{ $t('wiki.category.' + category) }}</p>
      </header>

      <section class="wiki-page__details">
        <div class="wiki-page__image-container">
          <NuxtImg 
            v-if="item.image"
            :src="item.image" 
            format="webp" 
            width="400" 
            height="400" 
            class="wiki-page__image" 
            :alt="item.name" 
          />
        </div>
        
        <div class="wiki-page__info">
          <p class="wiki-page__lore">{{ item.description }}</p>
          
          <div class="wiki-page__metadata" v-if="item.location || item.quote || item.weight">
            <div class="wiki-page__meta-group" v-if="item.location">
              <span class="wiki-page__meta-label">{{ $t('wiki.label.location') }}</span>
              <span class="wiki-page__meta-value">{{ item.location }}</span>
            </div>
            
            <div class="wiki-page__meta-group" v-if="item.quote">
              <span class="wiki-page__meta-label">{{ $t('wiki.label.quote') }}</span>
              <span class="wiki-page__meta-value wiki-page__meta-value--quote">{{ item.quote }}</span>
            </div>
            
            <div class="wiki-page__meta-group" v-if="item.weight">
              <span class="wiki-page__meta-label">{{ $t('wiki.label.weight') }}</span>
              <span class="wiki-page__meta-value">{{ item.weight }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
