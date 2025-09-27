import { defineStore } from 'pinia'
import { charactersService } from './charactersService'
import type { Character, MarvelEntityState } from '../../types/marvel'

// Characters Store - Maneja el estado de characters
export const useCharactersStore = defineStore('characters', {
  state: (): MarvelEntityState<Character> & {
    currentPage: number
    itemsPerPage: number
    hasMore: boolean
    loadingMore: boolean
    totalFromServer: number
  } => ({
    entities: [],
    currentEntity: null,
    loading: false,
    loadingMore: false,
    error: null,
    searchQuery: '',
    currentPage: 0, // Empezamos en 0 para facilitar el cálculo de offset
    itemsPerPage: 9,
    hasMore: true,
    totalFromServer: 0
  }),

  getters: {
    filteredCharacters: (state) => {
      // Siempre devolver las entidades actuales, ya que la búsqueda se hace en el servidor
      return state.entities
    },

    charactersCount: (state) => state.totalFromServer,
    
    displayedCount: (state) => state.entities.length
  },

  actions: {
    async fetchCharacters() {
      this.loading = true
      this.error = null
      this.currentPage = 0
      this.entities = [] // Limpiar datos anteriores
      
      try {
        const offset = this.currentPage * this.itemsPerPage
        const characters = await charactersService.getCharacters(offset, this.itemsPerPage)
        this.entities = characters
        this.currentPage = 1
        // Asumir que hay más si recibimos el límite completo
        this.hasMore = characters.length === this.itemsPerPage
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error desconocido'
        console.error('Error fetching characters:', error)
      } finally {
        this.loading = false
      }
    },

    async loadMoreCharacters() {
      if (this.loadingMore || !this.hasMore || this.loading) return
      
      this.loadingMore = true
      
      try {
        const offset = this.currentPage * this.itemsPerPage
        const newCharacters = await charactersService.getCharacters(offset, this.itemsPerPage)
        
        if (newCharacters.length === 0) {
          this.hasMore = false
        } else {
          this.entities.push(...newCharacters)
          this.currentPage += 1
          // Si recibimos menos del límite, no hay más
          this.hasMore = newCharacters.length === this.itemsPerPage
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error cargando más personajes'
        console.error('Error loading more characters:', error)
      } finally {
        this.loadingMore = false
      }
    },
    
    selectCharacter(id: string | number) {
      // Buscar el personaje en los datos que ya tenemos en lugar de hacer una nueva llamada API
      const character = this.entities.find(c => c.id == id)
      if (character) {
        this.currentEntity = character
      } else {
        this.error = 'Personaje no encontrado'
        console.error('Character not found in entities:', id)
      }
    },

    async searchCharacters(query: string) {
      if (!query.trim()) {
        // Si no hay búsqueda, volver a cargar todos los personajes
        await this.fetchCharacters()
        return
      }

      this.loading = true
      this.error = null
      this.currentPage = 0
      this.entities = []
      
      try {
        const characters = await charactersService.searchCharacters(query, 0, this.itemsPerPage)
        this.entities = characters
        this.currentPage = 1
        this.hasMore = characters.length === this.itemsPerPage
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error en la búsqueda'
        console.error('Error searching characters:', error)
      } finally {
        this.loading = false
      }
    },

    async loadMoreSearchResults() {
      if (this.loadingMore || !this.hasMore || this.loading || !this.searchQuery.trim()) return
      
      this.loadingMore = true
      
      try {
        const offset = this.currentPage * this.itemsPerPage
        const newCharacters = await charactersService.searchCharacters(this.searchQuery, offset, this.itemsPerPage)
        
        if (newCharacters.length === 0) {
          this.hasMore = false
        } else {
          this.entities.push(...newCharacters)
          this.currentPage += 1
          this.hasMore = newCharacters.length === this.itemsPerPage
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error cargando más resultados'
        console.error('Error loading more search results:', error)
      } finally {
        this.loadingMore = false
      }
    },

    setSearchQuery(query: string) {
      this.searchQuery = query
      // Trigger búsqueda automáticamente
      this.searchCharacters(query)
    },

    clearCurrentCharacter() {
      this.currentEntity = null
    },

    clearSearch() {
      this.searchQuery = ''
      // Recargar todos los personajes cuando se limpia la búsqueda
      this.fetchCharacters()
    }
  }
})