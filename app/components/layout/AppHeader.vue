<script setup lang="ts">
// Navigation items
const navItems = [
  { label: 'Inventory', href: '#' },
  { label: 'Checklist', href: '#', active: true },
  { label: 'Map', href: '#' },
  { label: 'Grace', href: '#' },
]
</script>

<template>
  <header class="app-header">
    <div class="app-header__brand">
      <span class="app-header__logo">Gilded Reliquary</span>
    </div>

    <nav class="app-header__nav">
      <a
        v-for="item in navItems"
        :key="item.label"
        :href="item.href"
        class="app-header__nav-link"
        :class="{ 'app-header__nav-link--active': item.active }"
      >
        {{ item.label }}
      </a>
    </nav>

    <div class="app-header__actions">
      <button class="app-header__icon-btn" aria-label="Profile">
        <span class="material-symbols-outlined">account_circle</span>
      </button>
      <button class="app-header__icon-btn" aria-label="Settings">
        <span class="material-symbols-outlined">settings</span>
      </button>
    </div>

    <div class="app-header__glow-border" />
  </header>
</template>

