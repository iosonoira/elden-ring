export interface WikiEntity {
  id: string
  name: string
  image: string
  description: string
  location?: string
  category?: string
  quote?: string
  weight?: string
  attack?: Array<{ name: string, amount: number }>
  defence?: Array<{ name: string, amount: number }>
  scalesWith?: Array<{ name: string, scaling: string }>
}

export interface ApiResponse<T> {
  success: boolean
  count: number
  total: number
  data: T
}

// Tipo per le chiavi interne dell'applicazione
export type WikiCategory = 
  | 'armament' 
  | 'armor' 
  | 'talisman' 
  | 'magic' 
  | 'ashesOfWar' 
  | 'spiritAshes'
  | 'ammunition'
  | 'bosses'
  | 'classes'
  | 'creatures'
  | 'incantations'
  | 'items'
  | 'locations'
  | 'npcs'
  | 'shields'
  | 'sorceries'
  | 'spirits'

// Tipo separato per i path dell'API esterna (usato solo nel composable)
export type ApiCategory =
  | 'weapons'
  | 'armors'
  | 'talismans'
  | 'sorceries'
  | 'ashes'
  | 'spirits'
  | 'shields'
  | 'ammunition'
  | 'bosses'
  | 'classes'
  | 'creatures'
  | 'incantations'
  | 'items'
  | 'locations'
  | 'npcs'

// Tipo per le chiavi delle categorie interne (usato in store e composables)
export type CategoryKey =
  | 'armament'
  | 'armor'
  | 'talisman'
  | 'magic'
  | 'ashesOfWar'
  | 'spiritAshes'
  | 'ammunition'
  | 'bosses'
  | 'classes'
  | 'creatures'
  | 'incantations'
  | 'items'
  | 'locations'
  | 'npcs'
  | 'shields'
  | 'sorceries'
  | 'spirits'

// Tipo per un item del database con il suo ID aggiunto
export interface ItemData {
  name: string
  class?: string
  category?: string
}

export type ItemWithId = ItemData & { id: string }
