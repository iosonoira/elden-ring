import type { WikiCategory, ApiCategory } from '~/shared/types/EldenRingApi'

export const wikiCategoryToApi = (category: WikiCategory): string => {
  const map: Partial<Record<WikiCategory, ApiCategory>> = {
    'armament': 'weapons',
    'armor': 'armors',
    'talisman': 'talismans',
    'magic': 'sorceries',
    'ashesOfWar': 'ashes',
    'spiritAshes': 'spirits',
    'ammunition': 'ammos'
  }
  return map[category] || category
}
