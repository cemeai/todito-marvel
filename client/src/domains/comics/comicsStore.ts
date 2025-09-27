import { defineStore } from 'pinia'
import { comicsService } from './comicsService'
import type { Comic, MarvelEntityState } from '../../types/marvel'

// Comics Store - Maneja el estado de comics
export const useComicsStore = defineStore('comics', {
  state: (): MarvelEntityState<Comic> & {
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
    filteredComics: (state) => {
      // Siempre devolver las entidades actuales, ya que la búsqueda se hace en el servidor
      return state.entities
    },

    comicsCount: (state) => state.totalFromServer,
    
    displayedCount: (state) => state.entities.length
  },

  actions: {
    async fetchComics() {
      this.loading = true
      this.error = null
      this.currentPage = 0
      this.entities = [] // Limpiar datos anteriores
      
      try {
        const offset = this.currentPage * this.itemsPerPage
        const comics = await comicsService.getComics(offset, this.itemsPerPage)
        this.entities = comics
        this.currentPage = 1
        // Asumir que hay más si recibimos el límite completo
        this.hasMore = comics.length === this.itemsPerPage
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error desconocido'
        console.error('Error fetching comics:', error)
      } finally {
        this.loading = false
      }
    },

    async loadMoreComics() {
      if (this.loadingMore || !this.hasMore || this.loading) return
      
      this.loadingMore = true
      
      try {
        const offset = this.currentPage * this.itemsPerPage
        const newComics = await comicsService.getComics(offset, this.itemsPerPage)
        
        if (newComics.length === 0) {
          this.hasMore = false
        } else {
          this.entities.push(...newComics)
          this.currentPage += 1
          // Si recibimos menos del límite, no hay más
          this.hasMore = newComics.length === this.itemsPerPage
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error cargando más comics'
        console.error('Error loading more comics:', error)
      } finally {
        this.loadingMore = false
      }
    },

    selectComic(id: string | number) {
      // Buscar el comic en los datos que ya tenemos en lugar de hacer una nueva llamada API
      const comic = this.entities.find(c => c.id == id)
      if (comic) {
        this.currentEntity = comic
      } else {
        this.error = 'Comic no encontrado'
        console.error('Comic not found in entities:', id)
      }
    },

    async searchComics(query: string) {
      if (!query.trim()) {
        // Si no hay búsqueda, volver a cargar todos los comics
        await this.fetchComics()
        return
      }

      this.loading = true
      this.error = null
      this.currentPage = 0
      this.entities = []
      
      try {
        const comics = await comicsService.searchComics(query, 0, this.itemsPerPage)
        this.entities = comics
        this.currentPage = 1
        this.hasMore = comics.length === this.itemsPerPage
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error en la búsqueda'
        console.error('Error searching comics:', error)
      } finally {
        this.loading = false
      }
    },

    async loadMoreSearchResults() {
      if (this.loadingMore || !this.hasMore || this.loading || !this.searchQuery.trim()) return
      
      this.loadingMore = true
      
      try {
        const offset = this.currentPage * this.itemsPerPage
        const newComics = await comicsService.searchComics(this.searchQuery, offset, this.itemsPerPage)
        
        if (newComics.length === 0) {
          this.hasMore = false
        } else {
          this.entities.push(...newComics)
          this.currentPage += 1
          this.hasMore = newComics.length === this.itemsPerPage
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
      this.searchComics(query)
    },

    clearCurrentComic() {
      this.currentEntity = null
    },

    clearSearch() {
      this.searchQuery = ''
      // Recargar todos los comics cuando se limpia la búsqueda
      this.fetchComics()
    }
  }
})