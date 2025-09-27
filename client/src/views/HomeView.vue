<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-logo">
          <h1 class="marvel-title">MARVEL</h1>
          <div class="subtitle">Universe Explorer</div>
        </div>
        
        <p class="hero-description">
          Explora el universo Marvel con acceso completo a comics, personajes e historias. 
          Descubre más de 70 años de entretenimiento épico.
        </p>
        
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-number">50,000+</span>
            <span class="stat-label">Comics</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">1,500+</span>
            <span class="stat-label">Personajes</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">100,000+</span>
            <span class="stat-label">Historias</span>
          </div>
        </div>
        
        <div class="cta-buttons">
          <router-link to="/comics" class="btn btn-primary">
            <span>📚</span>
            Explorar Comics
          </router-link>
          <router-link to="/characters" class="btn btn-secondary">
            <span>🦸‍♂️</span>
            Ver Personajes
          </router-link>
          <router-link to="/stories" class="btn btn-secondary">
            <span>📖</span>
            Leer Historias
          </router-link>
        </div>
      </div>
      
      <!-- Background Pattern -->
      <div class="hero-background">
        <div class="comic-pattern"></div>
        <div class="spider-web"></div>
      </div>
    </section>
    
    <!-- Features Section -->
    <section class="features">
      <h2 class="section-title">¿Por qué Marvel Universe Explorer?</h2>
      
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🚀</div>
          <h3>Paginación Infinita</h3>
          <p>Carga contenido de forma fluida mientras navegas. Sin interrupciones, sin esperas.</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🔐</div>
          <h3>Autenticación Segura</h3>
          <p>Sistema de login con 2FA. Tu experiencia personalizada y segura.</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3>Búsqueda Rápida</h3>
          <p>Encuentra instantáneamente cualquier comic, personaje o historia.</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🎨</div>
          <h3>Interfaz Moderna</h3>
          <p>Diseño responsivo inspirado en los colores y estética Marvel.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// No necesitamos imports adicionales para esta página
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 50%, #1a1a1a 100%);
}

/* Hero Section */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(45deg, #ED1D24 0%, #c41e3a 25%, #1a1a1a 50%, #c41e3a 75%, #ED1D24 100%);
  background-size: 400% 400%;
  animation: gradientShift 8s ease-in-out infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.hero-content {
  text-align: center;
  z-index: 2;
  max-width: 800px;
  padding: 2rem;
  color: white;
}

.hero-logo {
  margin-bottom: 2rem;
}

.marvel-title {
  font-size: 4rem;
  font-weight: 900;
  color: white;
  text-shadow: 
    3px 3px 0px #000,
    6px 6px 10px rgba(0,0,0,0.8);
  margin: 0;
  letter-spacing: 8px;
}

.subtitle {
  font-size: 1.5rem;
  color: #FFF;
  font-weight: 300;
  margin-top: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
}

.hero-description {
  font-size: 1.2rem;
  line-height: 1.6;
  margin: 2rem 0;
  color: #f0f0f0;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin: 3rem 0;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 900;
  color: #ED1D24;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
}

.stat-label {
  display: block;
  font-size: 1rem;
  color: #ccc;
  margin-top: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 3rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  text-decoration: none;
  border-radius: 0;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: 2px solid transparent;
}

.btn-primary {
  background: #ED1D24;
  color: white;
  border-color: #ED1D24;
  box-shadow: 0 4px 15px rgba(237, 29, 36, 0.3);
}

.btn-primary:hover {
  background: #c41e3a;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(237, 29, 36, 0.5);
}

.btn-secondary {
  background: transparent;
  color: white;
  border-color: white;
}

.btn-secondary:hover {
  background: white;
  color: #ED1D24;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.3);
}

/* Background Pattern */
.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  opacity: 0.1;
}

.comic-pattern {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px),
    repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px);
  animation: slidePattern 20s linear infinite;
}

@keyframes slidePattern {
  0% { transform: translate(0, 0); }
  100% { transform: translate(40px, 40px); }
}

/* Features Section */
.features {
  padding: 5rem 2rem;
  background: #f8f9fa;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 900;
  color: #ED1D24;
  margin-bottom: 3rem;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  border-top: 4px solid #ED1D24;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(237, 29, 36, 0.2);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: #333;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

/* Responsive Design */
@media (max-width: 768px) {
  .marvel-title {
    font-size: 2.5rem;
    letter-spacing: 4px;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 200px;
    justify-content: center;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .hero-content {
    padding: 1rem;
  }
  
  .marvel-title {
    font-size: 2rem;
    letter-spacing: 2px;
  }
  
  .hero-description {
    font-size: 1rem;
  }
}
</style>
