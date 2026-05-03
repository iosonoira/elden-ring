<script setup lang="ts">
// Default layout wrapping all pages
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

