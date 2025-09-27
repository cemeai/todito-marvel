<template>
  <div class="comics-view">
    <h1>Comics Marvel</h1>
    
    <div class="comics-layout">
      <!-- Lista de Comics -->
      <div class="comics-list-section">
        <ComicList />
      </div>
    </div>
    
    <!-- Modal de detalles (se muestra/oculta automáticamente) -->
    <ComicDetails />
  </div>
</template>

<script setup lang="ts">
import ComicList from './components/ComicList.vue'
import ComicDetails from './components/ComicDetails.vue'
import { useComicsStore } from './comicsStore'

// Conectamos con el store para acceder al estado
const comicsStore = useComicsStore()
</script>

<style scoped>
.comics-view {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
}

.comics-view h1 {
  text-align: center;
  color: #FFF;
  margin-bottom: 40px;
  font-size: 3rem;
  font-weight: 900;
  text-shadow: 3px 3px 6px rgba(0,0,0,0.7);
  letter-spacing: 2px;
  text-transform: uppercase;
}

.comics-layout {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.comics-list-section {
  width: 100%;
}

/* Responsive: En pantallas pequeñas */
@media (max-width: 768px) {
  .comics-view {
    padding: 20px 10px;
  }

  .comics-view h1 {
    font-size: 2rem;
    margin-bottom: 30px;
  }
}
</style>