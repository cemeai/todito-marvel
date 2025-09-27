<template>
  <div class="story-list marvel-list">
    
    <!-- Buscador -->
    <div class="search-section">
      <input
        type="text"
        v-model="searchQuery"
        @input="handleSearch"
        placeholder="Buscar historias por título o descripción..."
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
    <div v-if="storiesStore.loading" class="loading-message">
      Cargando historias...
    </div>
    
    <!-- Mostrar error si algo falla -->
    <div v-if="storiesStore.error" class="error">
      Error: {{ storiesStore.error }}
    </div>
    
    <!-- Mostrar lista de historias cuando tenemos datos -->
    <div v-if="!storiesStore.loading && !storiesStore.error" class="stories-container marvel-container" ref="storiesContainer" @scroll="handleScroll">
      <div v-if="storiesStore.filteredStories.length === 0" class="no-results">
        No se encontraron historias que coincidan con tu búsqueda.
      </div>
      
      <div class="stories-grid marvel-grid">
        <div 
          v-for="story in storiesStore.filteredStories" 
          :key="story.id"
          @click="selectStory(story.id)"
          class="story-card marvel-card"
        >
          <div 
            class="story-image-placeholder marvel-image-placeholder"
            :style="story.imageUrl && !story.imageUrl.includes('image_not_available') 
              ? { backgroundImage: `url(${story.imageUrl})` } 
              : {}"
          >
            <div v-if="!story.imageUrl || story.imageUrl.includes('image_not_available')" class="no-image">Sin imagen</div>
          </div>
          
          <div class="story-content marvel-content">
            <h3 class="story-title marvel-title">{{ story.title }}</h3>
            <p class="story-description marvel-description">{{ story.description || 'Sin descripción disponible' }}</p>
            
            <div class="story-meta marvel-meta">
              <span class="story-info marvel-date">Historia Marvel</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Indicador de "Cargando más..." -->
      <div v-if="storiesStore.loadingMore" class="loading-more">
        <div class="spinner"></div>
        <span>Cargando más historias...</span>
      </div>
      
      <!-- Indicador de fin de contenido -->
      <div v-if="!storiesStore.hasMore && storiesStore.entities.length > 0" class="end-message">
        No hay más historias para mostrar
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStoriesStore } from '../storiesStore'
import { computed, ref, onMounted } from 'vue'

// Conectamos con el store
const storiesStore = useStoriesStore()

// Referencia al contenedor de scroll
const storiesContainer = ref<HTMLElement>()

// Término de búsqueda local
const searchQuery = computed({
  get: () => storiesStore.searchQuery,
  set: (value: string) => storiesStore.setSearchTerm(value)
})

// Función para manejar la búsqueda
const handleSearch = () => {
  // La búsqueda se maneja automáticamente por el getter filteredComics
}

// Función para limpiar búsqueda
const clearSearch = () => {
  storiesStore.clearSearch()
}

// Función para seleccionar una historia
const selectStory = (id: string | number) => {
  storiesStore.selectStory(id)
}

// Función para manejar scroll infinito
const handleScroll = () => {
  if (!storiesContainer.value) return
  
  const container = storiesContainer.value
  const scrollTop = container.scrollTop
  const scrollHeight = container.scrollHeight
  const clientHeight = container.clientHeight
  
  // Cargar más cuando estamos cerca del final (100px antes del final)
  if (scrollHeight - scrollTop - clientHeight < 100) {
    // Si hay búsqueda activa, usar loadMoreSearchResults, sino usar loadMoreStories
    if (storiesStore.searchQuery.trim()) {
      storiesStore.loadMoreSearchResults()
    } else {
      storiesStore.loadMoreStories()
    }
  }
}

// Cuando el componente se monta, carga las historias solo si no están ya cargadas
onMounted(() => {
  // Solo hacer fetch si no hay historias cargadas aún
  if (storiesStore.entities.length === 0 && !storiesStore.loading) {
    storiesStore.fetchStories()
  }
})
</script>

<style>
/* Importar estilos compartidos */
@import '@/assets/marvel-list-components.css';
</style>

<style scoped>
/* Estilos específicos para Stories */
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
  border-top: 1px solid rgba(237, 29, 36, 0.1);
}
</style>