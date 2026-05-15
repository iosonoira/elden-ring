<script setup lang="ts">
const localePath = useLocalePath()
const route = useRoute()

const wikiCategories = [
  { label: 'Weapons', href: '/wiki/armament' },
  { label: 'Armor', href: '/wiki/armor' },
  { label: 'Talismans', href: '/wiki/talisman' },
  { label: 'Magic', href: '/wiki/magic' },
  { label: 'Ashes of War', href: '/wiki/ashesOfWar' },
  { label: 'Spirit Ashes', href: '/wiki/spiritAshes' },
  { label: 'Ammo', href: '/wiki/ammunition' },
  { label: 'Bosses', href: '/wiki/bosses' },
  { label: 'Classes', href: '/wiki/classes' },
  { label: 'Creatures', href: '/wiki/creatures' },
  { label: 'Incantations', href: '/wiki/incantations' },
  { label: 'Items', href: '/wiki/items' },
  { label: 'Locations', href: '/wiki/locations' },
  { label: 'NPCs', href: '/wiki/npcs' },
  { label: 'Shields', href: '/wiki/shields' },
  { label: 'Sorceries', href: '/wiki/sorceries' },
  { label: 'Spirits', href: '/wiki/spirits' },
]

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement>()

const closeDropdown = () => {
  isOpen.value = false
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}
</script>

<template>
  <div class="app-header__nav-item" ref="dropdownRef">
    <button 
      class="app-header__nav-link"
      :class="{ 'app-header__nav-link--active': isOpen || route.path.startsWith('/wiki') }"
      @click="toggleDropdown"
      aria-haspopup="true"
      :aria-expanded="isOpen"
    >
      <span>Wiki</span>
      <Icon 
        name="material-symbols:keyboard-arrow-down-rounded" 
        size="16" 
        :class="{ 'wiki-dropdown__arrow--open': isOpen }"
      />
    </button>

    <Transition name="dropdown-fade">
      <div v-if="isOpen" class="app-header__nav-item__menu">
        <NuxtLink 
          v-for="item in wikiCategories" 
          :key="item.href"
          :to="localePath(item.href)"
          class="app-header__nav-item__item"
          @click="closeDropdown"
        >
          {{ item.label }}
        </NuxtLink>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss">
.app-header__nav-item {
  position: relative;

  .app-header__nav-link {
    display: inline-flex;
    align-items: center;
    gap: $space-1;

    .wiki-dropdown__arrow--open {
      transform: rotate(180deg);
    }
  }

  &__menu {
    position: absolute;
    top: calc(100% + #{$space-2});
    left: 50%;
    transform: translateX(-50%);
    @include glass-panel;
    min-width: 180px;
    padding: $space-2;
    border-radius: $radius-md;
    z-index: $z-overlay;
  }

  &__item {
    display: block;
    padding: $space-3 $space-4;
    color: $color-on-surface;
    font-family: $font-body;
    font-size: $text-body;
    text-decoration: none;
    border-radius: $radius-sm;
    transition: color $transition-fast, background $transition-fast;

    &:hover {
      color: $color-primary;
      background: rgba($color-primary, 0.08);
    }
  }
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity $transition-fast, transform $transition-fast;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-4px);
}
</style>