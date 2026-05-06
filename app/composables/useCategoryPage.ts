import type { Ref } from 'vue'
import { useSaveStore } from '~/stores/useSaveStore'

type FilterValue = 'all' | 'owned' | 'missing'
type CategoryKey = 'armament' | 'armor' | 'talisman' | 'magic' | 'ashesOfWar' | 'spiritAshes'

interface CategoryPageItem {
  id: string
  name: string
  class?: string
  category?: string
  owned: boolean
}

const CATEGORY_TITLES: Record<string, string> = {
  armament: 'Armaments & Weapons',
  armor: 'Ancient Protections',
  talisman: 'Sacred Talismans',
  magic: 'Sorceries & Incantations',
  ashesOfWar: 'Ashes of War',
  spiritAshes: 'Spectral Spirits'
}

export function useCategoryPage(defaultFilter: FilterValue) {
  const route = useRoute()
  const store = useSaveStore()

  const category = computed(() => route.params.category as string)
  const categoryTitle = computed(() => CATEGORY_TITLES[category.value] ?? 'The Archive')
  const activeFilter = ref<FilterValue>(defaultFilter)

  const items = computed<CategoryPageItem[]>(() => {
    const result: CategoryPageItem[] = []
    const catKey = category.value as CategoryKey

    if (activeFilter.value !== 'missing' && store.ownedItems?.[catKey]) {
      (store.ownedItems[catKey] as CategoryPageItem[]).forEach(i =>
        result.push({ ...i, owned: true })
      )
    }

    if (activeFilter.value !== 'owned' && store.missingItems?.[catKey]) {
      (store.missingItems[catKey] as CategoryPageItem[]).forEach(i =>
        result.push({ ...i, owned: false })
      )
    }

    return result.sort((a, b) => a.name.localeCompare(b.name))
  })

  const stats = computed(() => {
    const catKey = category.value as CategoryKey
    return store.stats?.[catKey] ?? { owned: 0, total: 0 }
  })

  const selectedItem = ref<CategoryPageItem | null>(null)

  function selectItem(item: CategoryPageItem) {
    selectedItem.value = item
  }

  watch([items, category], () => {
    if (items.value.length > 0) {
      const stillExists = items.value.find(i => i.id === selectedItem.value?.id)
      if (!stillExists) selectedItem.value = items.value[0] ?? null
    } else {
      selectedItem.value = null
    }
  }, { immediate: true })

  return {
    category,
    categoryTitle,
    activeFilter,
    items,
    stats,
    selectedItem,
    selectItem
  }
}