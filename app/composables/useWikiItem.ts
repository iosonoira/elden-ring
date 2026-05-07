import type { WikiCategory, WikiEntity } from "~/shared/types/EldenRingApi"


export function useWikiItem<T extends WikiEntity>(category: WikiCategory | Ref<WikiCategory>, id: string | Ref<string>) {
  const { fetchEntity } = useEldenRingApi()
  const { data, pending, error } = fetchEntity<T>(unref(category), unref(id))

  const item = computed(() => data.value?.data ?? null)

  return { item, pending, error }
}
