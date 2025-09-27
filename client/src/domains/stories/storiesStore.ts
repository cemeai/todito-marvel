import { defineStore } from 'pinia'
import { storiesService } from './storiesService'
import type { Story, MarvelEntityState } from '../../types/marvel'

// Stories Store - Maneja el estado de historias
export const useStoriesStore = defineStore('stories', {
  state: (): MarvelEntityState<Story> & {
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
    filteredStories: (state) => {
      // Siempre devolver las entidades actuales, ya que la búsqueda se hace en el servidor
      return state.entities
    },

    storiesCount: (state) => state.totalFromServer,
    
    displayedCount: (state) => state.entities.length
  },

  actions: {
    async fetchStories() {
      this.loading = true
      this.error = null
      this.currentPage = 0
      this.entities = [] // Limpiar datos anteriores
      
      try {
        const offset = this.currentPage * this.itemsPerPage
        const stories = await storiesService.getStories(offset, this.itemsPerPage)
        this.entities = stories
        this.currentPage = 1
        // Asumir que hay más si recibimos el límite completo
        this.hasMore = stories.length === this.itemsPerPage
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error desconocido'
        console.error('Error fetching stories:', error)
      } finally {
        this.loading = false
      }
    },

    async loadMoreStories() {
      if (this.loadingMore || !this.hasMore || this.loading) return
      
      this.loadingMore = true
      
      try {
        const offset = this.currentPage * this.itemsPerPage
        const newStories = await storiesService.getStories(offset, this.itemsPerPage)
        
        if (newStories.length === 0) {
          this.hasMore = false
        } else {
          this.entities.push(...newStories)
          this.currentPage += 1
          // Si recibimos menos del límite, no hay más
          this.hasMore = newStories.length === this.itemsPerPage
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error cargando más historias'
        console.error('Error loading more stories:', error)
      } finally {
        this.loadingMore = false
      }
    },

    selectStory(id: string | number) {
      // Buscar la historia en los datos que ya tenemos en lugar de hacer una nueva llamada API
      const story = this.entities.find(s => s.id == id)
      if (story) {
        this.currentEntity = story
      } else {
        this.error = 'Historia no encontrada'
        console.error('Story not found in entities:', id)
      }
    },

    async searchStories(query: string) {
      if (!query.trim()) {
        // Si no hay búsqueda, volver a cargar todas las historias
        await this.fetchStories()
        return
      }

      this.loading = true
      this.error = null
      this.currentPage = 0
      this.entities = []
      
      try {
        const stories = await storiesService.searchStories(query, 0, this.itemsPerPage)
        this.entities = stories
        this.currentPage = 1
        this.hasMore = stories.length === this.itemsPerPage
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error en la búsqueda'
        console.error('Error searching stories:', error)
      } finally {
        this.loading = false
      }
    },

    async loadMoreSearchResults() {
      if (this.loadingMore || !this.hasMore || this.loading || !this.searchQuery.trim()) return
      
      this.loadingMore = true
      
      try {
        const offset = this.currentPage * this.itemsPerPage
        const newStories = await storiesService.searchStories(this.searchQuery, offset, this.itemsPerPage)
        
        if (newStories.length === 0) {
          this.hasMore = false
        } else {
          this.entities.push(...newStories)
          this.currentPage += 1
          this.hasMore = newStories.length === this.itemsPerPage
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error cargando más resultados'
        console.error('Error loading more search results:', error)
      } finally {
        this.loadingMore = false
      }
    },

    setSearchTerm(query: string) {
      this.searchQuery = query
      // Trigger búsqueda automáticamente
      this.searchStories(query)
    },

    clearCurrentStory() {
      this.currentEntity = null
    },

    clearSearch() {
      this.searchQuery = ''
      // Recargar todas las historias cuando se limpia la búsqueda
      this.fetchStories()
    }
  }
})