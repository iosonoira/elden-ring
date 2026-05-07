<script setup lang="ts">
definePageMeta({ layout: 'default' })

const localePath = useLocalePath()

useSeoMeta({
  title: 'Wiki | Gilded Reliquary',
  description: 'Browse the complete archives of Elden Ring items, weapons, armor, and more.',
})

const categories = [
  { key: 'armament', label: 'wiki.category.weapons', icon: 'swords' },
  { key: 'armor', label: 'wiki.category.armor', icon: 'shield_person' },
  { key: 'talisman', label: 'wiki.category.talismans', icon: 'brightness_7' },
  { key: 'magic', label: 'wiki.category.magic', icon: 'auto_awesome' },
  { key: 'ashesOfWar', label: 'wiki.category.ashesOfWar', icon: 'settings' },
  { key: 'spiritAshes', label: 'wiki.category.spiritAshes', icon: 'person_outline' },
]
</script>

<template>
  <div class="wiki-index-page">
    <header class="wiki-index-page__header">
      <div class="wiki-index-page__title-group">
        <span class="wiki-index-page__subtitle label-mono">The Archives</span>
        <h1 class="wiki-index-page__title">
          <Icon name="material-symbols:menu-book-outline" size="32" class="grace-glow" />
          Wiki
        </h1>
      </div>
    </header>

    <section class="wiki-index-page__grid">
      <NuxtLink
        v-for="cat in categories"
        :key="cat.key"
        :to="localePath(`/wiki/${cat.key}`)"
        class="wiki-category-card"
      >
        <div class="wiki-category-card__icon-wrap">
          <Icon :name="`material-symbols:${cat.icon}`" size="48" />
        </div>
        <h2 class="wiki-category-card__title">{{ $t(cat.label) }}</h2>
        <Icon name="material-symbols:arrow-forward" class="wiki-category-card__arrow" size="20" />
      </NuxtLink>
    </section>
  </div>
</template>

<style scoped>
.wiki-index-page {
  padding: var(--spacing-xl) var(--spacing-md);
  max-width: 1200px;
  margin: 0 auto;
}

.wiki-index-page__header {
  margin-bottom: var(--spacing-xl);
}

.wiki-index-page__subtitle {
  display: block;
  font-size: var(--font-size-sm);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  opacity: 0.6;
  margin-bottom: var(--spacing-xs);
}

.wiki-index-page__title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-family: var(--font-family-headline);
  font-size: var(--font-size-3xl);
  font-weight: 600;
}

.wiki-index-page__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--spacing-lg);
}

.wiki-category-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: inherit;
  transition: all var(--transition-fast);
}

.wiki-category-card:hover {
  border-color: var(--color-accent);
  background: var(--color-surface-hover);
  transform: translateY(-2px);
}

.wiki-category-card__icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: var(--color-surface-elevated);
  border-radius: var(--radius-md);
  color: var(--color-accent);
}

.wiki-category-card__title {
  flex: 1;
  font-family: var(--font-family-body);
  font-size: var(--font-size-lg);
  font-weight: 500;
}

.wiki-category-card__arrow {
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.wiki-category-card:hover .wiki-category-card__arrow {
  opacity: 1;
}
</style>