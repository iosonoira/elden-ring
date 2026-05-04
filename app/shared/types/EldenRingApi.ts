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

export type WikiCategory = 
  | 'armament' 
  | 'armor' 
  | 'talisman' 
  | 'magic' 
  | 'ashesOfWar' 
  | 'spiritAshes'
  | 'weapons'
  | 'armors'
  | 'talismans'
  | 'sorceries'
  | 'ashes'
  | 'spirits'
