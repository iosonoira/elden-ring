import type { WikiCategory, WikiEntity } from "~/shared/types/EldenRingApi"


export function useWikiItem<T extends WikiEntity>(category: WikiCategory, id: string) {
  const { fetchEntity } = useEldenRingApi()
  const { data, pending, error } = fetchEntity<T>(category, id)

  const item = computed(() => data.value?.data ?? null)

  return { item, pending, error }
}
