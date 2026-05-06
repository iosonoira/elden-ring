import type { ApiResponse, WikiCategory, ApiCategory, WikiEntity } from "~/shared/types/EldenRingApi";

const BASE_URL = 'https://eldenring.fanapis.com/api'

export function useEldenRingApi() {

  function fetchEntity<T extends WikiEntity>(category: WikiCategory, id: string) {
    return useAsyncData<ApiResponse<T>>(
      `wiki-${category}-${id}`,
      () => $fetch<ApiResponse<T>>(`${BASE_URL}/${category}/${id}`)
    )
  }

  function fetchList<T extends WikiEntity>(
    category: WikiCategory,
    params?: { limit?: number; page?: number }
  ) {
    return useAsyncData<ApiResponse<T[]>>(
      `wiki-${category}-list-${params?.page ?? 0}`,
      () => $fetch<ApiResponse<T[]>>(`${BASE_URL}/${category}`, {
        query: { limit: params?.limit ?? 20, page: params?.page ?? 0 }
      })
    )
  }

  function getByName<T extends WikiEntity>(category: string, name: string, options: any = {}) {
    // Map internal categories to Fan API categories
    const apiCategoryMap: Record<WikiCategory, ApiCategory> = {
      'armament':   'weapons',
      'armor':      'armors',
      'talisman':   'talismans',
      'magic':      'sorceries',
      'ashesOfWar': 'ashes',
      'spiritAshes':'spirits'
    }
    
    const finalCategory = apiCategoryMap[category] || category

    return useAsyncData<T | null>(
      `wiki-${category}-${name}`,
      async () => {
        try {
          const response = await $fetch<ApiResponse<T[]>>(`${BASE_URL}/${finalCategory}`, {
            query: { name }
          })
          if (response.success && response.data.length > 0) {
            return response.data[0] as T
          }
          return null
        } catch (e) {
          console.error(`Failed to fetch ${name} from ${finalCategory}`, e)
          return null
        }
      },
      options
    )
  }

  return { fetchEntity, fetchList, getByName }
}
