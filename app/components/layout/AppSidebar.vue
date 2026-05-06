<script setup lang="ts">
import { useSaveStore } from '~/stores/useSaveStore';

const store = useSaveStore();
const { stats, globalStats, isLoaded, selectedCharacter } = storeToRefs(store);

interface SidebarItem {
  key: string
  label: string
  icon: string
  active?: boolean
  owned: number
  total: number
}

const localePath = useLocalePath()
const route = useRoute()

const getInventoryTarget = (category: string) => {
  return isLoaded.value 
    ? localePath(`/inventory/${category}`)
    : localePath(`/archives/${category}`)
}

const getItemTooltip = (item: SidebarItem) => {
  const target = getInventoryTarget(item.key)
  const targetLabel = target.includes('/inventory/') ? 'Inventory' : 'Archives'
  return isLoaded.value 
    ? `${item.label} — Go to Inventory`
    : `${item.label} — Redirects to Archives (no save loaded)`
}

const getIconName = (item: SidebarItem) => {
  const base = item.icon.replace(/_/g, '-')
  const isActive = route.path.includes(item.key)
  if (item.icon.endsWith('outline')) {
    return isActive ? `material-symbols:${base.replace('-outline', '')}` : `material-symbols:${base}`
  }
  return isActive ? `material-symbols:${base}` : `material-symbols:${base}-outline`
}

const items = computed<SidebarItem[]>(() => {
  const s = stats.value;
  return [
    { 
      key: 'armament', 
      label: 'Weapons', 
      icon: 'swords', 
      owned: s?.armament?.owned || 0, 
      total: s?.armament?.total || 0 
    },
    { 
      key: 'armor', 
      label: 'Armor', 
      icon: 'shield_person', 
      owned: s?.armor?.owned || 0, 
      total: s?.armor?.total || 0 
    },
    { 
      key: 'talisman', 
      label: 'Talismans', 
      icon: 'brightness_7', 
      owned: s?.talisman?.owned || 0, 
      total: s?.talisman?.total || 0 
    },
    { 
      key: 'magic', 
      label: 'Magic', 
      icon: 'auto_awesome', 
      owned: s?.magic?.owned || 0, 
      total: s?.magic?.total || 0 
    },
    { 
      key: 'ashesOfWar', 
      label: 'Ashes of War', 
      icon: 'settings', 
      owned: s?.ashesOfWar?.owned || 0, 
      total: s?.ashesOfWar?.total || 0 
    },
    { 
      key: 'spiritAshes', 
      label: 'Spirit Ashes', 
      icon: 'person_outline', 
      owned: s?.spiritAshes?.owned || 0, 
      total: s?.spiritAshes?.total || 0 
    },
  ]
});
</script>

<template>
  <aside class="app-sidebar">
    <!-- User profile card -->
    <div class="app-sidebar__profile">
      <div class="app-sidebar__avatar">
        <Icon name="material-symbols:person-outline" size="24" />
      </div>
      <div class="app-sidebar__identity">
        <h3 class="app-sidebar__username">
          {{ selectedCharacter ? selectedCharacter.name : 'The Sovereign Archive' }}
        </h3>
        <p class="app-sidebar__level" v-if="isLoaded">
          {{ globalStats.percent }}% Journey Complete
        </p>
        <div v-if="isLoaded" class="app-sidebar__progress-mini">
          <div class="app-sidebar__progress-fill" :style="{ width: `${globalStats.percent}%` }" />
        </div>
      </div>
    </div>

    <!-- Nav items -->
    <nav class="app-sidebar__nav">
      <NuxtLink
        v-for="item in items"
        :key="item.key"
        :to="getInventoryTarget(item.key)"
        class="app-sidebar__item"
        active-class="app-sidebar__item--active"
        role="link"
        :aria-label="getItemTooltip(item)"
        :title="getItemTooltip(item)"
      >
        <div class="app-sidebar__item-main">
          <Icon :name="getIconName(item)" class="app-sidebar__item-icon" size="20" />
          <span class="app-sidebar__item-label">{{ item.label }}</span>
        </div>
        <div class="app-sidebar__item-stat label-mono" v-if="item.total > 0">
          {{ item.owned }}/{{ item.total }}
        </div>
      </NuxtLink>
    </nav>

  </aside>
</template>
