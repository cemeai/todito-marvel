<template>
  <div class="comic-list marvel-list">
    
    <!-- Buscador -->
    <div class="search-section">
      <input
        type="text"
        v-model="searchQuery"
        @input="handleSearch"
        placeholder="Buscar comics por título o descripción..."
        class="search-input"
      />
      <button 
        v-if="searchQuery"
        @click="clearSearch"
        class="clear-search-btn"
      >
        ✕
      </button>
    </div>
    
    <!-- Mostrar loading mientras carga -->
    <div v-if="comicsStore.loading" class="loading-message">
      Cargando comics...
    </div>
    
    <!-- Mostrar error si algo falla -->
    <div v-if="comicsStore.error" class="error">
      Error: {{ comicsStore.error }}
    </div>
    
    <!-- Mostrar lista de comics cuando tenemos datos -->
    <div v-if="!comicsStore.loading && !comicsStore.error" class="comics-container marvel-container" ref="comicsContainer" @scroll="handleScroll">
      <div v-if="comicsStore.filteredComics.length === 0" class="no-results">
        No se encontraron comics que coincidan con tu búsqueda.
      </div>
      
      <div class="comics-grid marvel-grid">
        <div 
          v-for="comic in comicsStore.filteredComics" 
          :key="comic.id"
          @click="selectComic(comic.id)"
          class="comic-card marvel-card"
        >
          <div 
            class="comic-image-placeholder marvel-image-placeholder"
            :style="comic.imageUrl && !comic.imageUrl.includes('image_not_available') 
              ? { backgroundImage: `url(${comic.imageUrl})` } 
              : {}"
          >
            <div v-if="!comic.imageUrl || comic.imageUrl.includes('image_not_available')" class="no-image">Sin imagen</div>
          </div>
          
          <div class="comic-content marvel-content">
            <h3 class="comic-title marvel-title">{{ comic.title }}</h3>
            <p class="comic-description marvel-description">{{ comic.description || 'Sin descripción disponible' }}</p>
            
            <div class="comic-meta marvel-meta">
              <span class="comic-price marvel-price">${{ comic.price || '0.00' }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Indicador de "Cargando más..." -->
      <div v-if="comicsStore.loadingMore" class="loading-more">
        <div class="spinner"></div>
        <span>Cargando más comics...</span>
      </div>
      
      <!-- Indicador de fin de contenido -->
      <div v-if="!comicsStore.hasMore && comicsStore.entities.length > 0" class="end-message">
        No hay más comics para mostrar
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useComicsStore } from '../comicsStore'
import { computed, ref, onMounted } from 'vue'

// Conectamos con el store
const comicsStore = useComicsStore()

// Referencia al contenedor de scroll
const comicsContainer = ref<HTMLElement>()

// Término de búsqueda local
const searchQuery = computed({
  get: () => comicsStore.searchQuery,
  set: (value: string) => comicsStore.setSearchTerm(value)
})

// Función para manejar la búsqueda
const handleSearch = () => {
  // La búsqueda se maneja automáticamente por el getter filteredComics
}

// Función para limpiar búsqueda
const clearSearch = () => {
  comicsStore.clearSearch()
}

// Función para seleccionar un comic
const selectComic = (id: string | number) => {
  comicsStore.selectComic(id)
}

// Función para manejar scroll infinito
const handleScroll = () => {
  if (!comicsContainer.value) return
  
  const container = comicsContainer.value
  const scrollTop = container.scrollTop
  const scrollHeight = container.scrollHeight
  const clientHeight = container.clientHeight
  
  // Cargar más cuando estamos cerca del final (100px antes del final)
  if (scrollHeight - scrollTop - clientHeight < 100) {
    // Si hay búsqueda activa, usar loadMoreSearchResults, sino usar loadMoreComics
    if (comicsStore.searchQuery.trim()) {
      comicsStore.loadMoreSearchResults()
    } else {
      comicsStore.loadMoreComics()
    }
  }
}

// Cuando el componente se monta, carga los comics solo si no están ya cargados
onMounted(() => {
  // Solo hacer fetch si no hay comics cargados aún
  if (comicsStore.entities.length === 0 && !comicsStore.loading) {
    comicsStore.fetchComics()
  }
})
</script>

<style>
/* Importar estilos compartidos */
@import '@/assets/marvel-list-components.css';
</style>

<style scoped>
/* Estilos específicos para Comics */
.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #4A4A4A;
  font-weight: 600;
  gap: 12px;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #ED1D24;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.end-message {
  text-align: center;
  padding: 20px;
  color: #888;
  font-style: italic;
  background: rgba(237, 29, 36, 0.05);
  border-top: 1px solid rgba(237, 29, 36, 0.1);
}
</style>