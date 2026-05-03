<script setup lang="ts">
// Navigation items
const navItems = [
  { label: 'Inventory', href: '#' },
  { label: 'Checklist', href: '#', active: true },
  { label: 'Map', href: '#' },
  { label: 'Grace', href: '#' },
]

// Sidebar items (copied here for mobile view consistency)
const sidebarItems = [
  { label: 'Equipment', icon: 'shield' },
  { label: 'Magic', icon: 'magic_button' },
  { label: 'Materials', icon: 'category' },
  { label: 'Key Items', icon: 'vpn_key', active: true },
  { label: 'Info', icon: 'info' },
]

const isMobileMenuOpen = ref(false)
</script>

<template>
  <header class="app-header">
    <!-- Hamburger (Mobile Only) -->
    <button class="app-header__hamburger" @click="isMobileMenuOpen = true" aria-label="Open menu">
      <Icon name="material-symbols:menu-rounded" size="28" />
    </button>

    <div class="app-header__brand">
      <span class="app-header__logo">Gilded Reliquary</span>
    </div>

    <nav class="app-header__nav">
      <a v-for="item in navItems" :key="item.label" :href="item.href" class="app-header__nav-link"
        :class="{ 'app-header__nav-link--active': item.active }">
        {{ item.label }}
      </a>
    </nav>

    <div class="app-header__actions">
      <button class="app-header__icon-btn" aria-label="Settings">
        <Icon name="material-symbols:settings-outline" size="24" />
      </button>
    </div>

    <div class="app-header__glow-border" />

    <!-- Mobile unified menu -->
    <LayoutMobileMenu 
      :is-open="isMobileMenuOpen" 
      :nav-items="navItems" 
      :sidebar-items="sidebarItems"
      @close="isMobileMenuOpen = false" 
    />
  </header>
</template>
