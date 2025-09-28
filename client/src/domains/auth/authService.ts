// Auth Service - Maneja las llamadas a la API de autenticación
export class AuthService {
  private apiUrl: string

  constructor() {
    this.apiUrl = 'https://todito-marvel.onrender.com/auth'
  }

  // Helper para obtener headers con token
  private getHeaders(includeAuth: boolean = false, needsJson: boolean = true): HeadersInit {
    const headers: HeadersInit = {}

    // Solo agregar Content-Type si necesitamos enviar JSON
    if (needsJson) {
      headers['Content-Type'] = 'application/json'
    }

    if (includeAuth) {
      const token = localStorage.getItem('auth_token')
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }
    }

    return headers
  }

  // Registro de usuario
  async register(userData: {
    email: string
    password: string
    fullName: string
    role?: number
  }) {
    const response = await fetch(`${this.apiUrl}/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error en el registro')
    }

    return await response.json()
  }

  // Login - paso 1 (email + password)
  async login(email: string, password: string) {
    const response = await fetch(`${this.apiUrl}/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error en el login')
    }

    return await response.json()
  }

  // Login - paso 2 (verificar código 2FA)
  async verify2FA(userId: number, code: string) {
    const response = await fetch(`${this.apiUrl}/verify-2fa`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ userId, code })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Código 2FA inválido')
    }

    return await response.json()
  }

  // Obtener perfil del usuario
  async getProfile() {
    const response = await fetch(`${this.apiUrl}/profile`, {
      method: 'GET',
      headers: this.getHeaders(true, false) // Auth token pero sin Content-Type
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al obtener perfil')
    }

    return await response.json()
  }

  // Configurar 2FA (generar QR)
  async setup2FA() {
    const response = await fetch(`${this.apiUrl}/setup-2fa`, {
      method: 'POST',
      headers: this.getHeaders(true, false) // Auth token pero sin Content-Type JSON
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al configurar 2FA')
    }

    return await response.json()
  }

  // Activar 2FA (verificar primer código)
  async enable2FA(code: string) {
    const response = await fetch(`${this.apiUrl}/enable-2fa`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ code })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al activar 2FA')
    }

    return await response.json()
  }

  // Desactivar 2FA
  async disable2FA(password: string) {
    const response = await fetch(`${this.apiUrl}/disable-2fa`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ password })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al desactivar 2FA')
    }

    return await response.json()
  }

  // Logout (opcional - JWT es stateless)
  async logout() {
    const response = await fetch(`${this.apiUrl}/logout`, {
      method: 'POST',
      headers: this.getHeaders(true, false) // Auth token pero sin Content-Type
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al cerrar sesión')
    }

    return await response.json()
  }

  // Obtener todos los usuarios (solo admin)
  async getUsers() {
    const response = await fetch(`${this.apiUrl}/users`, {
      method: 'GET',
      headers: this.getHeaders(true, false) // Auth token pero sin Content-Type
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al obtener usuarios')
    }

    return await response.json()
  }
}

export const authService = new AuthService()