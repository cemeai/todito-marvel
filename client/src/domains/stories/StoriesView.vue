<template>
  <div class="stories-view">
    <h1>Historias Marvel</h1>
    
    <div class="stories-layout">
      <!-- Lista de Historias -->
      <div class="stories-list-section">
        <StoryList />
      </div>
    </div>
    
    <!-- Modal de detalles (se muestra/oculta automáticamente) -->
    <StoryDetails />
  </div>
</template>

<script setup lang="ts">
import StoryList from './components/StoryList.vue'
import StoryDetails from './components/StoryDetails.vue'
</script>

<style scoped>
.stories-view {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
}

.stories-view h1 {
  text-align: center;
  color: #FFF;
  margin-bottom: 40px;
  font-size: 3rem;
  font-weight: 900;
  text-shadow: 3px 3px 6px rgba(0,0,0,0.7);
  letter-spacing: 2px;
  text-transform: uppercase;
}

.stories-layout {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.stories-list-section {
  width: 100%;
}

/* Responsive: En pantallas pequeñas */
@media (max-width: 768px) {
  .stories-view {
    padding: 20px 10px;
  }

  .stories-view h1 {
    font-size: 2rem;
    margin-bottom: 30px;
  }
  
  .stories-list-section {
    max-width: 100%;
  }
}
</style>