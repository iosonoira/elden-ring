import { defineStore } from 'pinia'
import type { WikiEntity, ApiResponse } from '~/shared/types/EldenRingApi'

export const useWikiStore = defineStore('wiki', () => {
  // null = "cercato ma non trovato". Key assente = "non ancora cercato".
  const cache = ref<Record<string, WikiEntity | null>>({})
  const loading = ref<Record<string, boolean>>({})

  // Lock per prevenire fetch concorrenti sulla stessa chiave
  const inFlight = new Set<string>()

  async function fetchItemDetails(category: string, name: string) {
    // Guard against null/undefined values
    if (!category || !name) return
    
    const cacheKey = `${category}-${name}`
    if (cacheKey in cache.value || inFlight.has(cacheKey)) return

    inFlight.add(cacheKey)
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
        // item cercato, non trovato
        cache.value[cacheKey] = null
      }
    } catch (e) {
      console.error(`WikiStore: Failed to fetch ${name}`, e)
    } finally {
      inFlight.delete(cacheKey)
      loading.value[cacheKey] = false
    }
  }

  const getCachedItem = (category: string, name: string) => {
    return cache.value[`${category}-${name}`] || null
  }

  const isItemLoading = (category: string, name: string) => {
    return loading.value[`${category}-${name}`] || false
  }

  return {
    cache,
    loading,
    fetchItemDetails,
    getCachedItem,
    isItemLoading
  }
})
