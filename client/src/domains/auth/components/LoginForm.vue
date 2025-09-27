<template>
  <div class="login-container">
    <div class="login-card">
      <!-- Header con logo Marvel -->
      <div class="login-header">
        <h1 class="marvel-title">MARVEL</h1>
        <p class="login-subtitle">Acceso al Universo</p>
      </div>

      <!-- Formulario de Login -->
      <form @submit.prevent="handleLogin" v-if="!authStore.pendingLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            :disabled="authStore.loading"
            placeholder="tu-email@marvel.com"
          />
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            :disabled="authStore.loading"
            placeholder="••••••••"
          />
        </div>

        <!-- Mostrar errores -->
        <div v-if="authStore.error" class="error-message">
          {{ authStore.error }}
        </div>

        <!-- Botón de login -->
        <button 
          type="submit" 
          class="login-btn"
          :disabled="authStore.loading"
        >
          <span v-if="authStore.loading">Verificando...</span>
          <span v-else>Iniciar Sesión</span>
        </button>
      </form>

      <!-- Formulario de 2FA -->
      <div v-if="authStore.pendingLogin" class="twofa-section">
        <h3>Verificación 2FA</h3>
        <p>Ingresa el código de tu aplicación autenticadora:</p>
        
        <form @submit.prevent="handle2FA">
          <div class="form-group">
            <label for="code2fa">Código de 6 dígitos</label>
            <input
              id="code2fa"
              v-model="twoFACode"
              type="text"
              required
              maxlength="6"
              pattern="[0-9]{6}"
              :disabled="authStore.loading"
              placeholder="123456"
              class="code-input"
            />
          </div>

          <div v-if="authStore.error" class="error-message">
            {{ authStore.error }}
          </div>

          <button 
            type="submit" 
            class="login-btn"
            :disabled="authStore.loading"
          >
            <span v-if="authStore.loading">Verificando...</span>
            <span v-else>Verificar Código</span>
          </button>

          <button 
            type="button" 
            class="cancel-btn"
            @click="cancelLogin"
            :disabled="authStore.loading"
          >
            Cancelar
          </button>
        </form>
      </div>

      <!-- Link para registro -->
      <div class="login-footer">
        <p>¿No tienes cuenta? 
          <router-link to="/register" class="register-link">
            Únete al universo Marvel
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../authStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Formulario de login
const form = reactive({
  email: '',
  password: ''
})

// Código 2FA
const twoFACode = ref('')

// Función para redirigir después del login
const redirectAfterLogin = () => {
  const redirectPath = route.query.redirect as string
  router.push(redirectPath || '/comics')
}

// Manejar login (paso 1)
const handleLogin = async () => {
  try {
    authStore.clearError()
    await authStore.login(form.email, form.password)
    
    // Si no requiere 2FA, redirigir directamente
    if (authStore.isAuthenticated) {
      redirectAfterLogin()
    }
    
  } catch (error) {
    console.error('Error en login:', error)
  }
}

// Manejar 2FA (paso 2)
const handle2FA = async () => {
  try {
    authStore.clearError()
    await authStore.verify2FA(twoFACode.value)
    
    // Redirigir después del login exitoso con 2FA
    redirectAfterLogin()
    
  } catch (error) {
    console.error('Error en 2FA:', error)
  }
}

// Cancelar login (volver al paso 1)
const cancelLogin = () => {
  authStore.pendingLogin = null
  twoFACode.value = ''
  authStore.clearError()
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0c1421 0%, #1a252f 100%);
  padding: 20px;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 40px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 2px solid #e23636;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.marvel-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #e23636;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 2px;
}

.login-subtitle {
  color: #666;
  margin: 10px 0 0 0;
  font-size: 1.1rem;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #e23636;
  box-shadow: 0 0 0 3px rgba(226, 54, 54, 0.1);
}

.form-group input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.code-input {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 4px;
}

.login-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(45deg, #e23636, #ff4444);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.login-btn:hover:not(:disabled) {
  background: linear-gradient(45deg, #cc2929, #e23636);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(226, 54, 54, 0.3);
}

.login-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.cancel-btn {
  width: 100%;
  padding: 12px;
  background: transparent;
  color: #666;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.3s ease;
}

.cancel-btn:hover:not(:disabled) {
  border-color: #999;
  color: #333;
}

.error-message {
  background: rgba(226, 54, 54, 0.1);
  border: 1px solid #e23636;
  color: #e23636;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: center;
}

.twofa-section {
  text-align: center;
}

.twofa-section h3 {
  color: #333;
  margin-bottom: 10px;
}

.twofa-section p {
  color: #666;
  margin-bottom: 20px;
}

.login-footer {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.login-footer p {
  color: #666;
  margin: 0;
}

.register-link {
  color: #e23636;
  text-decoration: none;
  font-weight: 600;
}

.register-link:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }
  
  .marvel-title {
    font-size: 2rem;
  }
}
</style>