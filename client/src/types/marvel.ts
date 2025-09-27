// Tipos compartidos para entidades Marvel
export interface Comic {
  id: number
  title: string
  description: string
  price: number
  date: string | null
  imageUrl: string | null
}

export interface Character {
  id: number
  name: string
  description: string
  imageUrl: string | null
}

export interface Story {
  id: number
  title: string
  description: string
  imageUrl: string | null
}

// Tipos para respuestas de API
export interface MarvelApiResponse<T> {
  success: boolean
  data: T
  total?: number
  entityType: string
}

// Estados para stores (genéricos)
export interface MarvelEntityState<T> {
  entities: T[]
  currentEntity: T | null
  loading: boolean
  error: string | null
  searchQuery: string
}