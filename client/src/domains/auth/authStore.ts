import { defineStore } from 'pinia'
import { authService } from './authService'

// Tipos para autenticación
export interface User {
  id: number
  email: string
  fullName: string
  role: number
  roleText: string
  twoFactorEnabled: boolean
  isActive: boolean
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  // Estado para 2FA
  pendingLogin: {
    userId: number | null
    requires2FA: boolean
  } | null
}

// Auth Store - Maneja el estado de autenticación
export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    pendingLogin: null
  }),

  getters: {
    userName: (state) => state.user?.fullName || 'Usuario',
    userEmail: (state) => state.user?.email || '',
    userRole: (state) => state.user?.role || 2,
    has2FAEnabled: (state) => state.user?.twoFactorEnabled || false
  },

  actions: {
    // Inicializar desde localStorage
    initialize() {
      const token = localStorage.getItem('auth_token')
      const user = localStorage.getItem('auth_user')
      
      if (token && user) {
        try {
          this.token = token
          this.user = JSON.parse(user)
          this.isAuthenticated = true
        } catch (error) {
          console.error('Error parsing user data:', error)
          this.logout()
        }
      }
    },

    // Login - paso 1 (email + password)
    async login(email: string, password: string) {
      this.loading = true
      this.error = null
      
      try {
        const response = await authService.login(email, password)
        
        if (response.requires2FA) {
          this.pendingLogin = {
            userId: response.userId,
            requires2FA: true
          }
        } else {
          // Login completo sin 2FA
          this.setAuthenticated(response.user, response.token)
        }
        
        return response
        
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Login - paso 2 (código 2FA)
    async verify2FA(code: string) {
      if (!this.pendingLogin?.userId) {
        throw new Error('No hay login pendiente')
      }
      
      this.loading = true
      this.error = null
      
      try {
        const response = await authService.verify2FA(this.pendingLogin.userId, code)
        
        this.setAuthenticated(response.user, response.token)
        this.pendingLogin = null
        
        return response
        
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Registro
    async register(userData: {
      email: string
      password: string
      fullName: string
    }) {
      this.loading = true
      this.error = null
      
      try {
        const response = await authService.register(userData)
        return response
        
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Establecer usuario autenticado
    setAuthenticated(user: User, token: string) {
      this.user = user
      this.token = token
      this.isAuthenticated = true
      
      // Guardar en localStorage
      localStorage.setItem('auth_token', token)
      localStorage.setItem('auth_user', JSON.stringify(user))
    },

    // Logout
    async logout() {
      try {
        // Llamar al service para notificar al backend
        await authService.logout()
      } catch (error) {
        // Incluso si el backend falla, limpiamos el estado local
        console.warn('Error en logout del backend:', error)
      }
      
      // Limpiar estado local siempre
      this.user = null
      this.token = null
      this.isAuthenticated = false
      this.pendingLogin = null
      this.error = null
      
      // Limpiar localStorage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    },

    // Limpiar errores
    clearError() {
      this.error = null
    }
  }
})