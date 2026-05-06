import { defineStore } from 'pinia';
import { SaveParser, type CharacterSlot } from '../utils/save-parser';

// Types for the JSON data structure
interface ItemData {
  name: string;
  class?: string;
  category?: string;
}

interface ItemDatabase {
  armament: Record<string, ItemData>;
  armor: Record<string, ItemData>;
  ashesOfWar: Record<string, ItemData>;
  magic: Record<string, ItemData>;
  spiritAshes: Record<string, ItemData>;
  talisman: Record<string, ItemData>;
}

export const useSaveStore = defineStore('save', () => {
  const isLoaded = ref(false);
  const characters = ref<CharacterSlot[]>([]);
  const selectedCharacterIndex = ref<number | null>(null);
  const foundItemIds = ref<string[]>([]);
  const isDlc = ref(false);
  
  // Database state
  const db = ref<ItemDatabase | null>(null);
  const dbLoadError = ref<string | null>(null);

  async function loadDatabase() {
    dbLoadError.value = null;
    if (db.value) return;
    
    // In a real Nuxt apps, we might fetch these or import them
    // For now, let's assume we can import them from the assets
    try {
      const [all, altered, unobtainable, dlc] = await Promise.all([
        import('../assets/data/all_items.json'),
        import('../assets/data/altered_armor.json'),
        import('../assets/data/unobtainable.json'),
        import('../assets/data/dlc_items.json')
      ]);

      const baseDb: ItemDatabase = JSON.parse(JSON.stringify(all.default));
      
      // Merge extra data
      // Armor
      Object.assign(baseDb.armor, altered.default);
      Object.assign(baseDb.armor, unobtainable.default.armor);
      Object.assign(baseDb.talisman, unobtainable.default.talisman);
      
      // DLC
      Object.assign(baseDb.armament, dlc.default.armament);
      Object.assign(baseDb.armor, dlc.default.armor);
      Object.assign(baseDb.talisman, dlc.default.talisman);
      Object.assign(baseDb.ashesOfWar, dlc.default.ashesOfWar);
      Object.assign(baseDb.magic, dlc.default.magic);
      Object.assign(baseDb.spiritAshes, dlc.default.spiritAshes);
      
      db.value = baseDb;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      dbLoadError.value = `Failed to load item database: ${message}`;
      console.error(dbLoadError.value, error);
    }
  }

  const parserInstance = shallowRef<SaveParser | null>(null);

  function handleFileUpload(file: File) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      if (!buffer) return;
      
      const parser = new SaveParser(buffer);
      if (!parser.isValid()) {
        alert('Invalid Elden Ring save file (.sl2)');
        return;
      }
      
      parserInstance.value = parser;
      characters.value = parser.getCharacterNames();
      isLoaded.value = true;
    };
    reader.readAsArrayBuffer(file);
  }

  function selectCharacter(index: number) {
    if (!parserInstance.value) return;

    const result = parserInstance.value.getInventoryIds(index);

    // DEBUG TEMPORANEO — rimuovere dopo
    console.log('[SaveStore] slot:', index)
    console.log('[SaveStore] ids found:', result.ids.length)
    console.log('[SaveStore] isDlc:', result.isDlc)
    console.log('[SaveStore] first 5 ids:', result.ids.slice(0, 5))

    foundItemIds.value = result.ids;
    isDlc.value = result.isDlc;
    selectedCharacterIndex.value = index;
  }

  const missingItems = computed(() => {
    if (!db.value) return null;
    
    const missing = {
      armament: [] as any[],
      armor: [] as any[],
      ashesOfWar: [] as any[],
      magic: [] as any[],
      spiritAshes: [] as any[],
      talisman: [] as any[],
    };
    
    const ownedIds = new Set(foundItemIds.value);
    
    const categories = ['armament', 'armor', 'ashesOfWar', 'magic', 'spiritAshes', 'talisman'] as const;
    
    categories.forEach(cat => {
      Object.entries(db.value![cat]).forEach(([id, data]) => {
        if (!ownedIds.has(id)) {
          missing[cat].push({ id, ...data });
        }
      });
    });
    
    return missing;
  });

  const ownedItems = computed(() => {
    if (!db.value) return null;

    // DEBUG TEMPORANEO — rimuovere dopo
    console.log('[SaveStore] foundItemIds.length:', foundItemIds.value.length)
    console.log('[SaveStore] db.armament keys sample:', Object.keys(db.value.armament).slice(0, 3))

    if (foundItemIds.value.length === 0) {
      return { armament: [], armor: [], ashesOfWar: [], magic: [], spiritAshes: [], talisman: [] };
    }
    
    const owned = {
      armament: [] as any[],
      armor: [] as any[],
      ashesOfWar: [] as any[],
      magic: [] as any[],
      spiritAshes: [] as any[],
      talisman: [] as any[],
    };
    
    // deduplicate IDs and check against DB
    const uniqueIds = new Set(foundItemIds.value);
    
    uniqueIds.forEach(id => {
      if (db.value?.armament[id]) owned.armament.push({ id, ...db.value.armament[id] });
      else if (db.value?.armor[id]) owned.armor.push({ id, ...db.value.armor[id] });
      else if (db.value?.ashesOfWar[id]) owned.ashesOfWar.push({ id, ...db.value.ashesOfWar[id] });
      else if (db.value?.magic[id]) owned.magic.push({ id, ...db.value.magic[id] });
      else if (db.value?.spiritAshes[id]) owned.spiritAshes.push({ id, ...db.value.spiritAshes[id] });
      else if (db.value?.talisman[id]) owned.talisman.push({ id, ...db.value.talisman[id] });
    });
    
    return owned;
  });

  const stats = computed(() => {
    if (!db.value) return null;
    const s: Record<string, { owned: number, total: number }> = {};
    const categories = ['armament', 'armor', 'ashesOfWar', 'magic', 'spiritAshes', 'talisman'] as const;
    
    const owned = ownedItems.value;
    const missing = missingItems.value;

    categories.forEach(cat => {
      const ownedCount = owned?.[cat]?.length || 0;
      const missingCount = missing?.[cat]?.length || 0;
      s[cat] = {
        owned: ownedCount,
        total: ownedCount + missingCount
      };
    });
    
    return s;
  });

  const globalStats = computed(() => {
    const s = stats.value;
    if (!s) return { owned: 0, total: 0, percent: 0 };
    
    let owned = 0;
    let total = 0;
    Object.values(s).forEach(v => {
      owned += v.owned;
      total += v.total;
    });
    
    return {
      owned,
      total,
      percent: total > 0 ? Math.round((owned / total) * 100) : 0
    };
  });

  const selectedCharacter = computed(() => {
    if (selectedCharacterIndex.value === null) return null;
    return characters.value[selectedCharacterIndex.value] || null;
  });

  return {
    isLoaded,
    characters,
    selectedCharacterIndex,
    selectedCharacter,
    foundItemIds,
    ownedItems,
    missingItems,
    stats,
    globalStats,
    dbLoadError,
    loadDatabase,
    handleFileUpload,
    selectCharacter
  };
});
