import type { Character, MarvelApiResponse } from './../../types/marvel'

// Characters Service - Maneja las llamadas a la API
export class CharactersService {
  private apiUrl: string

  constructor() {
    this.apiUrl = 'https://todito-marvel.onrender.com/api'
  }

  async getCharacters(offset: number = 0, limit: number = 20): Promise<Character[]> {
    const response = await fetch(`${this.apiUrl}/characters?offset=${offset}&limit=${limit}`)
    if (!response.ok) {
      throw new Error('Error al obtener characters')
    }
    const result: MarvelApiResponse<Character[]> = await response.json()
    return result.data // Extraer el array de characters del objeto respuesta
  }

  async searchCharacters(query: string, offset: number = 0, limit: number = 20): Promise<Character[]> {
    const encodedQuery = encodeURIComponent(query.trim())
    const response = await fetch(`${this.apiUrl}/characters?nameStartsWith=${encodedQuery}&offset=${offset}&limit=${limit}`)
    if (!response.ok) {
      throw new Error('Error al buscar personajes')
    }
    const result: MarvelApiResponse<Character[]> = await response.json()
    return result.data
  }

  async getCharacterById(id: string | number): Promise<Character> {
    const response = await fetch(`${this.apiUrl}/characters/${id}`)
    if (!response.ok) {
      throw new Error('Error al obtener character')
    }
    const result = await response.json()
    return result.data // Extraer el character del objeto respuesta
  }
}

export const charactersService = new CharactersService()