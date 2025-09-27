<template>
  <!-- Modal overlay para detalles del comic -->
  <div v-if="comicsStore.currentEntity" class="modal-overlay" @click="closeDetails">
    <div class="modal-content" @click.stop>
      <button class="modal-close" @click="closeDetails">✕</button>
      
      <div class="modal-body">
        <div class="modal-image">
          <div 
            class="modal-image-bg"
            :style="comicsStore.currentEntity.imageUrl && !comicsStore.currentEntity.imageUrl.includes('image_not_available') 
              ? { backgroundImage: `url(${comicsStore.currentEntity.imageUrl})` } 
              : {}"
          >
            <div v-if="!comicsStore.currentEntity.imageUrl || comicsStore.currentEntity.imageUrl.includes('image_not_available')" class="no-image">Sin imagen</div>
          </div>
        </div>
        
        <div class="modal-details">
          <h2 class="modal-title">{{ comicsStore.currentEntity.title }}</h2>
          
          <div class="modal-info">
            <div class="info-item">
              <strong>Descripción:</strong>
              <p>{{ comicsStore.currentEntity.description || 'Sin descripción disponible' }}</p>
            </div>
            
            <div class="info-item">
              <strong>Precio:</strong>
              <span class="modal-price">${{ comicsStore.currentEntity.price || '0.00' }}</span>
            </div>
            
            <div class="info-item" v-if="comicsStore.currentEntity.date">
              <strong>Fecha de publicación:</strong>
              <span>{{ formatDate(comicsStore.currentEntity.date) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useComicsStore } from '../comicsStore'

const comicsStore = useComicsStore()

// Función para cerrar los detalles
const closeDetails = () => {
  comicsStore.clearCurrentComic()
}

// Función para formatear fecha
const formatDate = (date: string | null | undefined) => {
  if (!date) return 'No disponible'
  return new Date(date).toLocaleDateString()
}
</script>

<style scoped>
/* Estilos del Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  position: relative;
  animation: modalSlideIn 0.3s ease-out;
  overflow: hidden;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #ED1D24;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 16px;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  background: #c41e1e;
}

.modal-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  min-height: 400px;
}

.modal-image {
  background: #f0f0f0;
}

.modal-image-bg {
  width: 100%;
  height: 100%;
  min-height: 400px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 16px;
}

.no-image {
  background: rgba(255, 255, 255, 0.9);
  padding: 1rem;
  border-radius: 4px;
}

.modal-details {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #4A4A4A;
  margin: 0 0 1.5rem 0;
  line-height: 1.3;
}

.modal-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item strong {
  color: #333;
  font-size: 1rem;
  font-weight: 600;
}

.info-item p {
  color: #555;
  line-height: 1.6;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
  padding-right: 8px;
}

/* Scrollbar personalizado para la descripción */
.info-item p::-webkit-scrollbar {
  width: 6px;
}

.info-item p::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.info-item p::-webkit-scrollbar-thumb {
  background: #ED1D24;
  border-radius: 3px;
}

.info-item p::-webkit-scrollbar-thumb:hover {
  background: #c41e1e;
}

.modal-price {
  color: #ED1D24;
  font-weight: 700;
  font-size: 1.2rem;
}

/* Responsive para modal */
@media (max-width: 768px) {
  .modal-body {
    grid-template-columns: 1fr;
  }
  
  .modal-image-bg {
    min-height: 250px;
  }
  
  .modal-details {
    padding: 1.5rem;
  }
}
</style>