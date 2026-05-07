<script setup lang="ts">
const localePath = useLocalePath();
const route = useRoute();

// Navigation items
const navItems = computed(() => [
  { label: 'Checklist', href: localePath('/'), active: route.path === '/' },
  { label: 'Archives', href: localePath('/archives/armament'), active: route.path.startsWith('/archives') },
  { label: 'Wiki', href: localePath('/wiki'), active: route.path.startsWith('/wiki') },
  { label: 'Inventory', href: localePath('/inventory/armament'), active: route.path.startsWith('/inventory') },
])

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
      <NuxtLink to="/" class="app-header__logo">Gilded Reliquary</NuxtLink>
    </div>

    <nav class="app-header__nav">
      <NuxtLink v-for="item in navItems" :key="item.label" :to="item.href" class="app-header__nav-link"
        :class="{ 'app-header__nav-link--active': item.active }">
        {{ item.label }}
      </NuxtLink>
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
