<template>
  <div class="inventory-skeleton">
    <!-- Header -->
    <div class="inventory-skeleton__header">
      <div class="inventory-skeleton__title-group">
        <div class="skeleton-block inventory-skeleton__subtitle" />
        <div class="skeleton-block inventory-skeleton__title" />
      </div>
      <div class="skeleton-block inventory-skeleton__filter" />
    </div>

    <!-- Section header -->
    <div class="inventory-skeleton__section-header">
      <div class="skeleton-block inventory-skeleton__icon" />
      <div class="skeleton-block inventory-skeleton__category-name" />
      <div class="skeleton-block inventory-skeleton__badge" />
    </div>

    <!-- Grid -->
    <div class="inventory-skeleton__grid">
      <div
        v-for="i in 12"
        :key="i"
        class="skeleton-card"
        :style="{ '--i': i }"
      >
        <div class="skeleton-block skeleton-card__image" />
        <div class="skeleton-block skeleton-card__name" />
        <div class="skeleton-block skeleton-card__sub" />
      </div>
    </div>
  </div>
</template>