import type { Ref } from 'vue'
import type { WikiEntity, ApiResponse, WikiCategory } from '~/shared/types/EldenRingApi'

const API_BASE = 'https://eldenring.fanapis.com/api'

export function useWikiCategory(category: string | Ref<string>) {
  const categoryRef = toRef(category)

  const items = ref<WikiEntity[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const apiCategory = computed(() => wikiCategoryToApi(categoryRef.value as WikiCategory))

  async function fetchAll() {
    loading.value = true
    error.value = null
    
    try {
      const response = await $fetch<ApiResponse<WikiEntity[]>>(`${API_BASE}/${apiCategory.value}`, {
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

  watch(categoryRef, () => {
    fetchAll()
  })

  return {
    items,
    loading,
    error,
    fetch: fetchAll
  }
}