<script setup lang="ts">
import type { WikiCategory, WikiEntity } from '~/shared/types/EldenRingApi'

definePageMeta({ layout: 'default' })

const route = useRoute()
const localePath = useLocalePath()
const { t } = useI18n()

const category = computed(() => route.params.category as WikiCategory)
const id = computed(() => route.params.id as string)

const { item, pending, error } = useWikiItem<WikiEntity>(category, id)

useSeoMeta({
  title: computed(() => item.value?.name ? `${item.value.name} | Gilded Reliquary` : t('wiki.page.titleFallback')),
  description: computed(() => item.value?.description || t('wiki.page.descFallback'))
})

// hpCost "0" means no HP cost — filter it out
const hasHpCost = computed(() => item.value?.hpCost && item.value.hpCost !== '0')

// Combined requirements: weapons use requiredAttributes, spells use requires
const requirements = computed(() => item.value?.requiredAttributes ?? item.value?.requires ?? [])

// Info chips: all simple key-value fields that exist
const hasInfoSection = computed(() =>
  !!(item.value?.location || item.value?.weight || item.value?.type ||
     item.value?.category || item.value?.role || item.value?.region ||
     item.value?.healthPoints || item.value?.fpCost || hasHpCost.value ||
     item.value?.affinity || item.value?.skill || item.value?.slots || item.value?.cost)
)
</script>

<template>
  <div class="wiki-page">
    <!-- Breadcrumb -->
    <nav class="wiki-page__breadcrumb">
      <NuxtLink :to="localePath('/wiki')">{{ $t('wiki.index.title') }}</NuxtLink>
      <Icon name="material-symbols:chevron-right" size="16" />
      <NuxtLink :to="localePath(`/wiki/${category}`)">{{ $t(`wiki.category.${category}`) }}</NuxtLink>
      <Icon name="material-symbols:chevron-right" size="16" />
      <span>{{ item?.name }}</span>
    </nav>

    <!-- Pending State -->
    <div v-if="pending" class="wiki-page__skeleton">
      <div class="wiki-page__skeleton-img" />
      <div class="wiki-page__skeleton-info">
        <div class="wiki-page__skeleton-text wiki-page__skeleton-text--hero" />
        <div class="wiki-page__skeleton-text" />
        <div class="wiki-page__skeleton-text" />
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="wiki-page__error">
      <h2 class="error-title">{{ $t('wiki.error.title') }}</h2>
      <p class="error-message">{{ $t('wiki.error.message') }}</p>
    </div>

    <!-- Data Loaded -->
    <div v-else-if="item" class="wiki-page__content">
      <header class="wiki-page__header">
        <h1 class="wiki-page__title">{{ item.name }}</h1>
        <p class="wiki-page__type">{{ $t(`wiki.category.${category}`) }}</p>
      </header>

      <!-- Hero Image -->
      <div class="wiki-page__hero">
        <NuxtImg
          v-if="item.image"
          :src="item.image"
          format="webp"
          width="500"
          height="500"
          class="wiki-page__hero-image"
          :alt="item.name"
        />
      </div>

      <!-- Lore description -->
      <p class="wiki-page__lore">{{ item.description }}</p>

      <!-- Info chips -->
      <section v-if="hasInfoSection" class="wiki-page__section">
        <span class="wiki-page__section-title">{{ $t('wiki.label.info') }}</span>
        <div class="wiki-page__chips-grid">
          <WikiChip v-if="item.location" :label="$t('wiki.label.location')" :value="item.location" />
          <WikiChip v-if="item.weight" :label="$t('wiki.label.weight')" :value="item.weight" />
          <WikiChip v-if="item.category" :label="$t('wiki.label.itemType')" :value="item.category" />
          <WikiChip v-if="item.type" :label="$t('wiki.label.spellType')" :value="item.type" />
          <WikiChip v-if="item.role" :label="$t('wiki.label.role')" :value="item.role" />
          <WikiChip v-if="item.region" :label="$t('wiki.label.region')" :value="item.region" />
          <WikiChip v-if="item.healthPoints" :label="$t('wiki.label.healthPoints')" :value="item.healthPoints" />
          <WikiChip v-if="item.cost" :label="$t('wiki.label.fpCost')" :value="item.cost" />
          <WikiChip v-if="item.slots" :label="$t('wiki.label.slots')" :value="item.slots" />
          <WikiChip v-if="item.fpCost" :label="$t('wiki.label.fpCost')" :value="item.fpCost" />
          <WikiChip v-if="hasHpCost" :label="$t('wiki.label.hpCost')" :value="item.hpCost!" />
          <WikiChip v-if="item.affinity" :label="$t('wiki.label.affinity')" :value="item.affinity" />
          <WikiChip v-if="item.skill" :label="$t('wiki.label.skill')" :value="item.skill" />
        </div>
      </section>

      <!-- Quote -->
      <section v-if="item.quote" class="wiki-page__section">
        <span class="wiki-page__section-title">{{ $t('wiki.label.quote') }}</span>
        <blockquote class="wiki-page__quote-block">{{ item.quote }}</blockquote>
      </section>

      <!-- Effect / Effects text -->
      <section v-if="item.effect || item.effects" class="wiki-page__section">
        <span class="wiki-page__section-title">{{ $t('wiki.label.effect') }}</span>
        <p class="wiki-page__effect-text">{{ item.effect || item.effects }}</p>
      </section>

      <!-- Attack stats -->
      <section v-if="item.attack?.length" class="wiki-page__section">
        <span class="wiki-page__section-title">{{ $t('wiki.label.stats') }}</span>
        <div class="wiki-page__stat-list">
          <WikiStatBar
            v-for="stat in item.attack"
            :key="stat.name"
            :name="stat.name"
            :amount="stat.amount"
            :max="300"
          />
        </div>
      </section>

      <!-- Defence stats -->
      <section v-if="item.defence?.length" class="wiki-page__section">
        <span class="wiki-page__section-title">{{ $t('wiki.label.defence') }}</span>
        <div class="wiki-page__stat-list">
          <WikiStatBar
            v-for="stat in item.defence"
            :key="stat.name"
            :name="stat.name"
            :amount="stat.amount"
            :max="100"
          />
        </div>
      </section>

      <!-- Damage Negation (armor) -->
      <section v-if="item.dmgNegation?.length" class="wiki-page__section">
        <span class="wiki-page__section-title">{{ $t('wiki.label.dmgNegation') }}</span>
        <div class="wiki-page__stat-list">
          <WikiStatBar
            v-for="stat in item.dmgNegation"
            :key="stat.name"
            :name="stat.name"
            :amount="stat.amount"
            :max="100"
          />
        </div>
      </section>

      <!-- Resistance (armor) -->
      <section v-if="item.resistance?.length" class="wiki-page__section">
        <span class="wiki-page__section-title">{{ $t('wiki.label.resistance') }}</span>
        <div class="wiki-page__stat-list">
          <WikiStatBar
            v-for="stat in item.resistance"
            :key="stat.name"
            :name="stat.name"
            :amount="stat.amount"
            :max="100"
          />
        </div>
      </section>

      <!-- Attribute Scaling -->
      <section v-if="item.scalesWith?.length" class="wiki-page__section">
        <span class="wiki-page__section-title">{{ $t('wiki.label.scaling') }}</span>
        <div class="wiki-page__badges-row">
          <WikiScalingBadge
            v-for="scale in item.scalesWith"
            :key="scale.name"
            :name="scale.name"
            :scaling="scale.scaling"
          />
        </div>
      </section>

      <!-- Requirements -->
      <section v-if="requirements.length" class="wiki-page__section">
        <span class="wiki-page__section-title">{{ $t('wiki.label.requirements') }}</span>
        <div class="wiki-page__chips-grid">
          <WikiChip
            v-for="req in requirements"
            :key="req.name"
            :label="req.name"
            :value="req.amount"
          />
        </div>
      </section>

      <!-- Drops -->
      <section v-if="item.drops?.length" class="wiki-page__section">
        <span class="wiki-page__section-title">{{ $t('wiki.label.drops') }}</span>
        <WikiDropList :drops="item.drops" />
      </section>
    </div>
  </div>
</template>
