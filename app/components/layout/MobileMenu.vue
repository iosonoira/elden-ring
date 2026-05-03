<script setup lang="ts">
// Menu mobile che unifica Header e Sidebar
const props = defineProps<{
  isOpen: boolean
  navItems: Array<{ label: string, href: string, active?: boolean }>
  sidebarItems: Array<{ label: string, icon: string, active?: boolean }>
}>()

defineEmits(['close'])
</script>

<template>
  <Transition name="mobile-fade">
    <div v-if="isOpen" class="mobile-menu" role="dialog" aria-modal="true">
      <!-- Overlay Backdrop -->
      <div class="mobile-menu__backdrop" @click="$emit('close')" />

      <!-- Content Panel -->
      <aside class="mobile-menu__panel">
        <div class="mobile-menu__header">
          <span class="app-header__logo">Gilded Reliquary</span>
          <button class="mobile-menu__close" @click="$emit('close')" aria-label="Close menu">
            <Icon name="material-symbols:close" size="28" />
          </button>
        </div>

        <div class="mobile-menu__content">
          <!-- Profile Quick Peek -->
          <div class="mobile-menu__section">
            <div class="app-sidebar__profile">
              <div class="app-sidebar__avatar">
                <Icon name="material-symbols:person-outline" size="24" />
              </div>
              <div class="app-sidebar__identity">
                <h3 class="app-sidebar__username">The Sovereign Archive</h3>
                <p class="app-sidebar__level">Level 150 — Elden Lord</p>
              </div>
            </div>
          </div>

          <!-- Main Nav (from Header) -->
          <div class="mobile-menu__section">
            <h4 class="mobile-menu__label">Navigation</h4>
            <nav class="mobile-menu__nav">
              <a 
                v-for="item in navItems" 
                :key="item.label" 
                :href="item.href"
                class="mobile-menu__link"
                :class="{ 'mobile-menu__link--active': item.active }"
                @click="$emit('close')"
              >
                {{ item.label }}
              </a>
            </nav>
          </div>

          <!-- Categories Nav (from Sidebar) -->
          <div class="mobile-menu__section">
            <h4 class="mobile-menu__label">Categories</h4>
            <div class="mobile-menu__grid">
              <div
                v-for="item in sidebarItems"
                :key="item.label"
                class="mobile-menu__icon-item"
                :class="{ 'mobile-menu__icon-item--active': item.active }"
                @click="$emit('close')"
              >
                <Icon :name="`material-symbols:${item.icon.replace(/_/g, '-')}-outline`" size="24" />
                <span>{{ item.label }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mobile-menu__footer">
          <p class="checklist-footer__motto">May Grace Guide Thee</p>
        </div>
      </aside>
    </div>
  </Transition>
</template>

<style lang="scss">
// Stili verranno messi in un file SCSS dedicato
</style>
