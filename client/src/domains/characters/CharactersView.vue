<template>
  <div class="characters-view">
    <h1>Personajes Marvel</h1>
    
    <div class="characters-layout">
      <!-- Lista de Personajes -->
      <div class="characters-list-section">
        <CharacterList />
      </div>
    </div>
    
    <!-- Modal de detalles (se muestra/oculta automáticamente) -->
    <CharacterDetails />
  </div>
</template>

<script setup lang="ts">
import CharacterList from './components/CharacterList.vue'
import CharacterDetails from './components/CharacterDetails.vue'
import { useCharactersStore } from './charactersStore'

// Conectamos con el store para acceder al estado
const charactersStore = useCharactersStore()
</script>

<style scoped>
.characters-view {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
}

.characters-view h1 {
  text-align: center;
  color: #FFF;
  margin-bottom: 40px;
  font-size: 3rem;
  font-weight: 900;
  text-shadow: 3px 3px 6px rgba(0,0,0,0.7);
  letter-spacing: 2px;
  text-transform: uppercase;
}

.characters-list-section {
  width: 100%;
}

/* Responsive: En pantallas pequeñas */
@media (max-width: 768px) {
  .characters-view {
    padding: 20px 10px;
  }

  .characters-view h1 {
    font-size: 2rem;
    margin-bottom: 30px;
  }
}
</style>