<script setup lang="ts">
import { useSaveStore } from '~/stores/useSaveStore';

const store = useSaveStore();

const activeSlots = computed(() => store.characters.filter(c => c.active));
</script>

<template>
  <div v-if="store.isLoaded" class="character-selector">
    <h3 class="character-selector__title">Select Character</h3>
    <div class="character-selector__grid">
      <button 
        v-for="char in activeSlots" 
        :key="char.index"
        class="char-btn"
        :class="{ 'char-btn--active': store.selectedCharacterIndex === char.index }"
        @click="store.selectCharacter(char.index)"
      >
        <div class="char-btn__glow" />
        <span class="char-btn__name">{{ char.name }}</span>
        <span class="char-btn__meta">Slot {{ char.index + 1 }}</span>
      </button>
    </div>
  </div>
</template>


