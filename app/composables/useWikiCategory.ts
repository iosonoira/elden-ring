import type { WikiEntity, ApiResponse } from '~/shared/types/EldenRingApi'

const API_BASE = 'https://eldenring.fanapis.com/api'

const CATEGORY_MAP: Record<string, string> = {
  armament: 'weapons',
  armor: 'armors',
  talisman: 'talismans',
  magic: 'sorceries',
  ashesOfWar: 'ashes',
  spiritAshes: 'spirits'
}

export function useWikiCategory(category: string) {
  const items = ref<WikiEntity[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    const apiCategory = CATEGORY_MAP[category] || category
    loading.value = true
    error.value = null
    
    try {
      const response = await $fetch<ApiResponse<WikiEntity[]>>(`${API_BASE}/${apiCategory}`, {
        query: { limit: 200 }
      })
      
      if (response.success && response.data) {
        items.value = response.data
      }
    } catch (e) {
      error.value = 'Failed to fetch items'
      if (import.meta.dev) console.error('useWikiCategory: fetch error', e)
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchAll)

  return {
    items,
    loading,
    error
  }
}