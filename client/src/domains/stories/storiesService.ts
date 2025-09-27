import type { Story, MarvelApiResponse } from '../../types/marvel'

// Stories Service - Maneja las llamadas a la API
export class StoriesService {
  private apiUrl: string

  constructor() {
    this.apiUrl = 'http://localhost:3000/api'
  }

  async getStories(offset: number = 0, limit: number = 20): Promise<Story[]> {
    const response = await fetch(`${this.apiUrl}/stories?offset=${offset}&limit=${limit}`)
    if (!response.ok) {
      throw new Error('Error al obtener historias')
    }
    const result: MarvelApiResponse<Story[]> = await response.json()
    return result.data // Extraer el array de historias del objeto respuesta
  }

  async searchStories(query: string, offset: number = 0, limit: number = 20): Promise<Story[]> {
    const encodedQuery = encodeURIComponent(query.trim())
    const response = await fetch(`${this.apiUrl}/stories?titleStartsWith=${encodedQuery}&offset=${offset}&limit=${limit}`)
    if (!response.ok) {
      throw new Error('Error al buscar historias')
    }
    const result: MarvelApiResponse<Story[]> = await response.json()
    return result.data
  }

  async getStoryById(id: string | number): Promise<Story> {
    const response = await fetch(`${this.apiUrl}/stories/${id}`)
    if (!response.ok) {
      throw new Error('Error al obtener historia')
    }
    const result = await response.json()
    return result.data // Extraer la historia del objeto respuesta
  }
}

export const storiesService = new StoriesService()
