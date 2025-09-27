<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from './domains/auth/authStore'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = async () => {
  await authStore.logout()
  // Redirigir a home después del logout
  router.push('/')
}
</script>

<template>
  <div id="app">
    <!-- Navbar fija en la parte superior -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-brand">
          <h1>Todito Marvel</h1>
        </div>
        
        <div class="nav-links">
          <RouterLink to="/" class="nav-link">Home</RouterLink>
          
          <!-- Links visibles solo cuando está autenticado -->
          <template v-if="authStore.isAuthenticated">
            <RouterLink to="/comics" class="nav-link">Comics</RouterLink>
            <RouterLink to="/characters" class="nav-link">Characters</RouterLink>
            <RouterLink to="/stories" class="nav-link">Stories</RouterLink>
          </template>
          
          <!-- Auth links -->
          <div class="auth-section">
            <template v-if="authStore.isAuthenticated">
              <RouterLink to="/profile" class="profile-link">Mi Perfil</RouterLink>
              <button @click="handleLogout" class="logout-btn">Logout</button>
            </template>
            <template v-else>
              <RouterLink to="/login" class="auth-link">Login</RouterLink>
              <RouterLink to="/register" class="auth-link register">Registro</RouterLink>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Contenido principal debajo del navbar -->
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

/* Navbar fijo */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #ED1D24 0%, #B71C1C 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.nav-brand h1 {
  color: #FFF;
  font-size: 1.8rem;
  font-weight: 900;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  letter-spacing: 1px;
}

.nav-links {
  display: flex;
  height: 100%;
  align-items: stretch;
  gap: 1rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
  padding: 0 0.5rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.nav-link:hover {
  background-color: rgba(65, 65, 65, 0.3);
  transform: translateY(-1px);
  color: #FFF;
}

.nav-link.router-link-active {
  background-color: rgba(65, 65, 65, 0.3);
  border-bottom: 3px solid #808080;
  color: #FFF;
}

/* Auth section */
.auth-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: 2rem;
}

.user-welcome {
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.auth-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.auth-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.auth-link.register {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.auth-link.register:hover {
  background: rgba(255, 255, 255, 0.3);
}

.profile-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.profile-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

/* Contenido principal */
.main-content {
  margin-top: 70px; /* Altura del navbar */
  min-height: calc(100vh - 70px);
  width: 100%;
  background: linear-gradient(135deg, #2C2C2C 0%, #000000 100%);
}

/* Responsive */
@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
    flex-direction: column;
    height: auto;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  .nav-brand h1 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .nav-links {
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .nav-link {
    font-size: 1rem;
    padding: 0.4rem 0.8rem;
  }

  .main-content {
    margin-top: 90px; /* Altura del navbar en móvil */
    min-height: calc(100vh - 90px);
  }
}
</style>
