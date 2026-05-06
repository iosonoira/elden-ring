<script setup lang="ts">
import { useSaveStore } from '~/stores/useSaveStore'

const store = useSaveStore()
onMounted(() => { store.loadDatabase() })
</script>

<template>
  <div class="default-layout">
    <LayoutAppHeader />
    <LayoutAppSidebar />
    <main class="default-layout__main">
      <slot />
    </main>
  </div>
</template>

