<script setup lang="ts">
interface SidebarItem {
  label: string
  icon: string
  active?: boolean
}

const items: SidebarItem[] = [
  { label: 'Equipment', icon: 'shield' },
  { label: 'Magic', icon: 'magic_button' },
  { label: 'Materials', icon: 'category' },
  { label: 'Key Items', icon: 'vpn_key', active: true },
  { label: 'Info', icon: 'info' },
]
</script>

<template>
  <aside class="app-sidebar">
    <!-- User profile card -->
    <div class="app-sidebar__profile">
      <div class="app-sidebar__avatar">
        <span class="material-symbols-outlined">person</span>
      </div>
      <div class="app-sidebar__identity">
        <h3 class="app-sidebar__username">The Sovereign Archive</h3>
        <p class="app-sidebar__level">Level 150 — Elden Lord</p>
      </div>
    </div>

    <!-- Nav items -->
    <nav class="app-sidebar__nav">
      <div
        v-for="item in items"
        :key="item.label"
        class="app-sidebar__item"
        :class="{ 'app-sidebar__item--active': item.active }"
        role="button"
        :tabindex="0"
        :aria-label="item.label"
      >
        <span class="material-symbols-outlined app-sidebar__item-icon">{{ item.icon }}</span>
        <span class="app-sidebar__item-label">{{ item.label }}</span>
      </div>
    </nav>
  </aside>
</template>

