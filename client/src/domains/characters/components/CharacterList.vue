<template>
  <div class="character-list marvel-list">
    
    <!-- Buscador -->
    <div class="search-section">
      <input
        type="text"
        v-model="searchQuery"
        @input="handleSearch"
        placeholder="Buscar personajes por nombre o descripción..."
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
    <div v-if="charactersStore.loading" class="loading-message">
      Cargando personajes...
    </div>
    
    <!-- Mostrar error si algo falla -->
    <div v-if="charactersStore.error" class="error">
      Error: {{ charactersStore.error }}
    </div>
    
    <!-- Mostrar lista de personajes cuando tenemos datos -->
    <div v-if="!charactersStore.loading && !charactersStore.error" class="characters-container marvel-container" ref="charactersContainer" @scroll="handleScroll">
      <div v-if="charactersStore.filteredCharacters.length === 0" class="no-results">
        No se encontraron personajes que coincidan con tu búsqueda.
      </div>
      
      <div class="characters-grid marvel-grid">
        <div 
          v-for="character in charactersStore.filteredCharacters" 
          :key="character.id"
          @click="selectCharacter(character.id)"
          class="character-card marvel-card"
        >
          <div 
            class="character-image-placeholder marvel-image-placeholder"
            :style="character.imageUrl && !character.imageUrl.includes('image_not_available') 
              ? { backgroundImage: `url(${character.imageUrl})` } 
              : {}"
          >
            <div v-if="!character.imageUrl || character.imageUrl.includes('image_not_available')" class="no-image">Sin imagen</div>
          </div>
          
          <div class="character-content marvel-content">
            <h3 class="character-title marvel-title">{{ character.name }}</h3>
            <p class="character-description marvel-description">{{ character.description || 'Sin descripción disponible' }}</p>
            
            <div class="character-meta marvel-meta">
              <span class="character-info marvel-date">Personaje Marvel</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Indicador de "Cargando más..." -->
      <div v-if="charactersStore.loadingMore" class="loading-more">
        <div class="spinner"></div>
        <span>Cargando más personajes...</span>
      </div>
      
      <!-- Indicador de fin de contenido -->
      <div v-if="!charactersStore.hasMore && charactersStore.entities.length > 0" class="end-message">
        No hay más personajes para mostrar
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCharactersStore } from '../charactersStore'
import { computed, ref, onMounted } from 'vue'

// Conectamos con el store
const charactersStore = useCharactersStore()

// Referencia al contenedor de scroll
const charactersContainer = ref<HTMLElement>()

// Término de búsqueda local
const searchQuery = computed({
  get: () => charactersStore.searchQuery,
  set: (value: string) => charactersStore.setSearchQuery(value)
})

// Función para manejar la búsqueda
const handleSearch = () => {
  // La búsqueda se maneja automáticamente por el getter filteredCharacters
}

// Función para limpiar búsqueda
const clearSearch = () => {
  charactersStore.clearSearch()
}

// Función para seleccionar un personaje
const selectCharacter = (id: string | number) => {
  charactersStore.selectCharacter(id)
}

// Función para manejar scroll infinito
const handleScroll = () => {
  if (!charactersContainer.value) return
  
  const container = charactersContainer.value
  const scrollTop = container.scrollTop
  const scrollHeight = container.scrollHeight
  const clientHeight = container.clientHeight
  
  // Cargar más cuando estamos cerca del final (100px antes del final)
  if (scrollHeight - scrollTop - clientHeight < 100) {
    // Si hay búsqueda activa, usar loadMoreSearchResults, sino usar loadMoreCharacters
    if (charactersStore.searchQuery.trim()) {
      charactersStore.loadMoreSearchResults()
    } else {
      charactersStore.loadMoreCharacters()
    }
  }
}

// Cuando el componente se monta, carga los personajes solo si no están ya cargados
onMounted(() => {
  // Solo hacer fetch si no hay personajes cargados aún
  if (charactersStore.entities.length === 0 && !charactersStore.loading) {
    charactersStore.fetchCharacters()
  }
})
</script>

<style>
/* Importar estilos compartidos */
@import '@/assets/marvel-list-components.css';
</style>

<style scoped>
/* Estilos específicos para Characters */
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