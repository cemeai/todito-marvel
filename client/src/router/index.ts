import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../domains/auth/authStore'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    // Rutas de autenticación
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
      meta: { requiresGuest: true } // Solo para usuarios no autenticados
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/RegisterView.vue'),
      meta: { requiresGuest: true } // Solo para usuarios no autenticados
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/auth/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    // Rutas de Marvel
    {
      path: '/comics',
      name: 'comics',
      component: () => import('../domains/comics/ComicsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/characters',
      name: 'characters',
      component: () => import('../domains/characters/CharactersView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/stories',
      name: 'stories',
      component: () => import('../domains/stories/StoriesView.vue'),
      meta: { requiresAuth: true }
    },
  ],
})

// Guard global para proteger rutas
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // Si no está autenticado, redirigir a login
      next({
        name: 'login',
        query: { redirect: to.fullPath } // Guardar la ruta original
      })
      return
    }
  }
  
  // Si la ruta es solo para invitados (login/register)
  if (to.meta.requiresGuest) {
    if (authStore.isAuthenticated) {
      // Si ya está autenticado, redirigir a comics
      next({ name: 'comics' })
      return
    }
  }
  
  // Continuar normalmente
  next()
})

export default router
