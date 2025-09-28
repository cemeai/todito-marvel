import type { Comic, MarvelApiResponse } from './../../types/marvel'

// Comics Service - Maneja las llamadas a la API
export class ComicsService {
  private apiUrl: string

  constructor() {
    this.apiUrl = 'https://todito-marvel.onrender.com/api'
  }

  async getComics(offset: number = 0, limit: number = 20): Promise<Comic[]> {
    const response = await fetch(`${this.apiUrl}/comics?offset=${offset}&limit=${limit}`)
    if (!response.ok) {
      throw new Error('Error al obtener comics')
    }
    const result: MarvelApiResponse<Comic[]> = await response.json()
    return result.data // Extraer el array de comics del objeto respuesta
  }

  async searchComics(query: string, offset: number = 0, limit: number = 20): Promise<Comic[]> {
    const encodedQuery = encodeURIComponent(query.trim())
    const response = await fetch(`${this.apiUrl}/comics?titleStartsWith=${encodedQuery}&offset=${offset}&limit=${limit}`)
    if (!response.ok) {
      throw new Error('Error al buscar comics')
    }
    const result: MarvelApiResponse<Comic[]> = await response.json()
    return result.data
  }

  async getComicById(id: string | number): Promise<Comic> {
    const response = await fetch(`${this.apiUrl}/comics/${id}`)
    if (!response.ok) {
      throw new Error('Error al obtener comic')
    }
    const result = await response.json()
    return result.data // Extraer el comic del objeto respuesta
  }
}

export const comicsService = new ComicsService()
