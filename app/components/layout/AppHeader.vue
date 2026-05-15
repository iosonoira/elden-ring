<script setup lang="ts">
import { useSaveStore } from '~/stores/useSaveStore'

const localePath = useLocalePath()
const route = useRoute()
const saveStore = useSaveStore()
const { isLoaded } = storeToRefs(saveStore)

// Navigation items
const navItems = computed(() => [
  { label: 'Checklist', href: localePath('/'), active: route.path === '/' },
  { label: 'Archives', href: localePath('/archives/armament'), active: route.path.startsWith('/archives') },
  { label: 'Inventory', href: localePath('/inventory/armament'), active: route.path.startsWith('/inventory') },
])

// Sidebar items (dynamic links for mobile view)
const sidebarItems = computed(() => {
  const getTarget = (cat: string) => {
    const inArchives = route.path.startsWith('/archives')
    if (inArchives) return localePath(`/archives/${cat}`)
    return isLoaded.value ? localePath(`/inventory/${cat}`) : localePath(`/archives/${cat}`)
  }

  return [
    { label: 'Weapons', icon: 'swords', href: getTarget('armament'), active: route.path.includes('armament') },
    { label: 'Armor', icon: 'shield_person', href: getTarget('armor'), active: route.path.includes('armor') },
    { label: 'Talismans', icon: 'brightness_7', href: getTarget('talisman'), active: route.path.includes('talisman') },
    { label: 'Magic', icon: 'auto_awesome', href: getTarget('magic'), active: route.path.includes('magic') },
    { label: 'Ashes', icon: 'settings', href: getTarget('ashesOfWar'), active: route.path.includes('ashesOfWar') },
    { label: 'Spirit', icon: 'person_outline', href: getTarget('spiritAshes'), active: route.path.includes('spiritAshes') },
  ]
})

const wikiCategories = [
  { label: 'Weapons', href: '/wiki/armament', icon: 'swords' },
  { label: 'Armor', href: '/wiki/armor', icon: 'shield_person' },
  { label: 'Talismans', href: '/wiki/talisman', icon: 'brightness_7' },
  { label: 'Bosses', href: '/wiki/bosses', icon: 'skull' },
  { label: 'NPCs', href: '/wiki/npcs', icon: 'groups' },
  { label: 'Locations', href: '/wiki/locations', icon: 'map' },
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
      <LayoutAppHeaderDropdown />
    </nav>

    <div class="app-header__actions" />

    <div class="app-header__glow-border" />

    <!-- Mobile unified menu -->
    <LayoutMobileMenu 
      :is-open="isMobileMenuOpen" 
      :nav-items="navItems" 
      :sidebar-items="sidebarItems"
      :wiki-items="wikiCategories"
      @close="isMobileMenuOpen = false" 
    />
  </header>
</template>
