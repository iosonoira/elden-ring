import type { ApiResponse, WikiCategory, ApiCategory, WikiEntity } from "~/shared/types/EldenRingApi";

const BASE_URL = 'https://eldenring.fanapis.com/api'

export function useEldenRingApi() {

  function fetchEntity<T extends WikiEntity>(category: WikiCategory, id: string) {
    const finalCategory = wikiCategoryToApi(category)
    return useAsyncData<ApiResponse<T>>(
      `wiki-${category}-${id}`,
      () => $fetch<ApiResponse<T>>(`${BASE_URL}/${finalCategory}/${id}`)
    )
  }

  function fetchList<T extends WikiEntity>(
    category: WikiCategory,
    params?: { limit?: number; page?: number }
  ) {
    const finalCategory = wikiCategoryToApi(category)
    return useAsyncData<ApiResponse<T[]>>(
      `wiki-${category}-list-${params?.page ?? 0}`,
      () => $fetch<ApiResponse<T[]>>(`${BASE_URL}/${finalCategory}`, {
        query: { limit: params?.limit ?? 20, page: params?.page ?? 0 }
      })
    )
  }

  function getByName<T extends WikiEntity>(
    category: WikiCategory,
    name: string,
    options: any = {}
  ) {
    const finalCategory = wikiCategoryToApi(category)

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
          if (import.meta.dev) console.error(`Failed to fetch ${name} from ${finalCategory}`, e)
          return null
        }
      },
      options
    )
  }

  return { fetchEntity, fetchList, getByName }
}
