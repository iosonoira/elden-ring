<script setup lang="ts">
definePageMeta({ layout: 'default' })

const localePath = useLocalePath()
const { t } = useI18n()

const categories = [
  { key: 'armament', label: 'wiki.category.weapons', icon: 'swords' },
  { key: 'armor', label: 'wiki.category.armor', icon: 'shield-person' },
  { key: 'talisman', label: 'wiki.category.talismans', icon: 'brightness-7' },
  { key: 'magic', label: 'wiki.category.magic', icon: 'auto-awesome' },
  { key: 'ashesOfWar', label: 'wiki.category.ashesOfWar', icon: 'settings' },
  { key: 'spiritAshes', label: 'wiki.category.spiritAshes', icon: 'person-outline' },
  { key: 'ammunition', label: 'wiki.category.ammo', icon: 'deployed-code' },
  { key: 'bosses', label: 'wiki.category.bosses', icon: 'skull' },
  { key: 'classes', label: 'wiki.category.classes', icon: 'person' },
  { key: 'creatures', label: 'wiki.category.creatures', icon: 'pets' },
  { key: 'incantations', label: 'wiki.category.incantations', icon: 'auto-stories' },
  { key: 'items', label: 'wiki.category.items', icon: 'inventory-2' },
  { key: 'locations', label: 'wiki.category.locations', icon: 'map' },
  { key: 'npcs', label: 'wiki.category.npcs', icon: 'groups' },
  { key: 'shields', label: 'wiki.category.shields', icon: 'shield' },
  { key: 'sorceries', label: 'wiki.category.sorceries', icon: 'magic-button' },
  { key: 'spirits', label: 'wiki.category.spirits', icon: 'air' },
]

useSeoMeta({
  title: computed(() => `${t('wiki.index.title')} | Gilded Reliquary`),
  description: t('wiki.intro')
})
</script>

<template>
  <div class="wiki-index-page">
    <header class="wiki-index-page__header">
      <h1 class="wiki-index-page__title">{{ $t('wiki.index.title') }}</h1>
      <p class="wiki-index-page__subtitle">{{ $t('wiki.intro') }}</p>
    </header>

    <div class="wiki-index-page__grid">
      <NuxtLink
        v-for="cat in categories"
        :key="cat.key"
        :to="localePath(`/wiki/${cat.key}`)"
        class="wiki-category-card glass-panel"
      >
        <div class="wiki-category-card__icon-wrap">
          <Icon :name="`material-symbols:${cat.icon}`" size="48" />
        </div>
        <h2 class="wiki-category-card__title">{{ $t(cat.label) }}</h2>
        <div class="wiki-category-card__arrow">
          <Icon name="material-symbols:arrow-forward-rounded" size="24" />
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wiki-index-page {
  padding: $space-12 $space-6;
  max-width: $content-max-w;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: $space-8 $space-4;
  }

  &__header {
    text-align: center;
    margin-bottom: $space-12;
  }

  &__title {
    font-family: $font-cinzel;
    font-size: 3rem;
    color: $color-primary;
    margin-bottom: $space-4;
    @include gold-glow-text;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  &__subtitle {
    font-family: $font-lora;
    font-style: italic;
    font-size: 1.25rem;
    color: rgba($color-on-surface, 0.7);
    max-width: 600px;
    margin: 0 auto;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: $space-4;

    @media (min-width: 768px) {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: $space-6;
    }
  }
}

.wiki-category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $space-8;
  text-decoration: none;
  transition: transform $transition-base, border-color $transition-base;
  text-align: center;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba($color-primary, 0.4);

    .wiki-category-card__icon-wrap {
      color: $color-primary;
      transform: scale(1.1);
    }

    .wiki-category-card__arrow {
      opacity: 1;
      transform: translateX(0);
    }
  }

  &__icon-wrap {
    margin-bottom: $space-4;
    color: rgba($color-primary, 0.6);
    transition: transform $transition-base, color $transition-base;
  }

  &__title {
    font-family: $font-headline;
    font-size: 1.5rem;
    color: $color-on-surface;
    margin: 0;
  }

  &__arrow {
    position: absolute;
    bottom: $space-4;
    right: $space-4;
    color: $color-primary;
    opacity: 0;
    transform: translateX(-8px);
    transition: opacity $transition-base, transform $transition-base;
  }
}
</style>
