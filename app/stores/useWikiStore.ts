import { defineStore } from 'pinia'
import type { WikiEntity, ApiResponse } from '~/shared/types/EldenRingApi'

export const useWikiStore = defineStore('wiki', () => {
  const cache = ref<Record<string, WikiEntity>>({})
  const loading = ref<Record<string, boolean>>({})

  async function fetchItemDetails(category: string, name: string) {
    // Guard against null/undefined values
    if (!category || !name) return
    
    const cacheKey = `${category}-${name}`
    if (cache.value[cacheKey] || loading.value[cacheKey]) return
    
    loading.value[cacheKey] = true
    
    try {
      const apiCategoryMap: Record<string, string> = {
        'armament': 'weapons',
        'armor': 'armors',
        'talisman': 'talismans',
        'magic': 'sorceries',
        'ashesOfWar': 'ashes',
        'spiritAshes': 'spirits'
      }
      
      const finalCategory = apiCategoryMap[category] || category
      const BASE_URL = 'https://eldenring.fanapis.com/api'
      
      // Attempt 1: Default mapping
      let response = await $fetch<ApiResponse<WikiEntity[]>>(`${BASE_URL}/${finalCategory}`, {
        query: { name }
      })

      // Attempt 2: If armament and not found in weapons, try shields
      if (category === 'armament' && (!response.data || response.data.length === 0)) {
        response = await $fetch<ApiResponse<WikiEntity[]>>(`${BASE_URL}/shields`, {
          query: { name }
        })
      }

      if (response.success && response.data && response.data.length > 0) {
        cache.value[cacheKey] = response.data[0] as any
      } else {
        // Mark as empty to avoid re-fetching failed items
        cache.value[cacheKey] = { id: 'null', name, image: '', description: 'No data found in digital archives.' } as any
      }
    } catch (e) {
      console.error(`WikiStore: Failed to fetch ${name}`, e)
    } finally {
      loading.value[cacheKey] = false
    }
  }

  const getCachedItem = (category: string, name: string) => {
    return computed(() => cache.value[`${category}-${name}`] || null)
  }

  const isItemLoading = (category: string, name: string) => {
    return computed(() => loading.value[`${category}-${name}`] || false)
  }

  return {
    cache,
    loading,
    fetchItemDetails,
    getCachedItem,
    isItemLoading
  }
})
