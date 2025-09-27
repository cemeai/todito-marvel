<template>
  <div class="register-container">
    <div class="register-card">
      <!-- Header con logo Marvel -->
      <div class="register-header">
        <h1 class="marvel-title">MARVEL</h1>
        <p class="register-subtitle">Únete al Universo</p>
      </div>

      <!-- Formulario de Registro -->
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="fullName">Nombre Completo</label>
          <input
            id="fullName"
            v-model="form.fullName"
            type="text"
            required
            :disabled="authStore.loading"
            placeholder="Ej: Tony Stark"
          />
        </div>

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
            minlength="6"
            :disabled="authStore.loading"
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirmar Contraseña</label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            required
            :disabled="authStore.loading"
            placeholder="Confirma tu contraseña"
          />
        </div>

        <!-- Mostrar errores -->
        <div v-if="authStore.error || passwordError" class="error-message">
          {{ authStore.error || passwordError }}
        </div>

        <!-- Mensaje de éxito -->
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <!-- Botón de registro -->
        <button 
          type="submit" 
          class="register-btn"
          :disabled="authStore.loading || !isFormValid"
        >
          <span v-if="authStore.loading">Creando cuenta...</span>
          <span v-else>Crear Cuenta</span>
        </button>
      </form>

      <!-- Link para login -->
      <div class="register-footer">
        <p>¿Ya tienes cuenta? 
          <router-link to="/login" class="login-link">
            Iniciar Sesión
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../authStore'

const router = useRouter()
const authStore = useAuthStore()

// Formulario de registro
const form = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const successMessage = ref('')

// Validación de contraseñas
const passwordError = computed(() => {
  if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
    return 'Las contraseñas no coinciden'
  }
  return ''
})

// Validar formulario completo
const isFormValid = computed(() => {
  return form.fullName.length > 0 &&
         form.email.length > 0 &&
         form.password.length >= 6 &&
         form.password === form.confirmPassword &&
         !passwordError.value
})

// Manejar registro
const handleRegister = async () => {
  if (!isFormValid.value) {
    return
  }

  try {
    authStore.clearError()
    successMessage.value = ''
    
    const response = await authStore.register({
      fullName: form.fullName,
      email: form.email,
      password: form.password
    })
    
    // Mostrar mensaje de éxito
    successMessage.value = response.message || 'Cuenta creada exitosamente'
    
    // Limpiar formulario
    Object.assign(form, {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
    
    // Redirigir al login después de 2 segundos
    setTimeout(() => {
      router.push('/login')
    }, 2000)
    
  } catch (error) {
    console.error('Error en registro:', error)
    successMessage.value = ''
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0c1421 0%, #1a252f 100%);
  padding: 20px;
}

.register-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 40px;
  max-width: 450px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 2px solid #e23636;
}

.register-header {
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

.register-subtitle {
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

.form-group input:invalid {
  border-color: #ff6b6b;
}

.form-group input:valid {
  border-color: #51cf66;
}

.register-btn {
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

.register-btn:hover:not(:disabled) {
  background: linear-gradient(45deg, #cc2929, #e23636);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(226, 54, 54, 0.3);
}

.register-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
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

.success-message {
  background: rgba(81, 207, 102, 0.1);
  border: 1px solid #51cf66;
  color: #2d8f3f;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: center;
}

.register-footer {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.register-footer p {
  color: #666;
  margin: 0;
}

.login-link {
  color: #e23636;
  text-decoration: none;
  font-weight: 600;
}

.login-link:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 480px) {
  .register-card {
    padding: 30px 20px;
  }
  
  .marvel-title {
    font-size: 2rem;
  }
}
</style>