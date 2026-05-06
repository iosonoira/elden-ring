import type { CategoryKey } from '~/shared/types/EldenRingApi'

export interface CategoryConfig {
  title: string    // Titolo lungo usato nelle pagine (es. "Armaments & Weapons")
  label: string    // Label breve usata nella sidebar (es. "Weapons")
  icon: string     // Nome icona Material Symbols (senza prefisso)
  lore: string     // Testo lore usato nella home
}

export const CATEGORY_CONFIG = {
  armament:   {
    title: 'Armaments & Weapons',
    label: 'Weapons',
    icon: 'swords',
    lore: 'Hand-held instruments of destruction',
  },
  armor:      {
    title: 'Ancient Protections',
    label: 'Armor',
    icon: 'shield_person',
    lore: 'Tarnished steel and royal silk',
  },
  talisman:   {
    title: 'Sacred Talismans',
    label: 'Talismans',
    icon: 'brightness_7',
    lore: 'Sacred trinkets blessed by the Erdtree',
  },
  magic:      {
    title: 'Sorceries & Incantations',
    label: 'Magic',
    icon: 'auto_awesome',
    lore: 'Spells and incantations of the primeval current',
  },
  ashesOfWar: {
    title: 'Ashes of War',
    label: 'Ashes of War',
    icon: 'settings',
    lore: 'Techniques of legendary warriors',
  },
  spiritAshes: {
    title: 'Spectral Spirits',
    label: 'Spirit Ashes',
    icon: 'person_outline',
    lore: 'Spectral remains of fallen combatants',
  },
} satisfies Record<CategoryKey, CategoryConfig>

// Array ordinato delle chiavi — usato per iterare le categorie nell'ordine corretto
export const CATEGORY_KEYS = Object.keys(CATEGORY_CONFIG) as CategoryKey[]