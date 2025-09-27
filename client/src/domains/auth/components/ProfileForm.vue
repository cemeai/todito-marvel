<template>
  <div class="profile-container">
    <div class="profile-card">
      <!-- Header -->
      <div class="profile-header">
        <h1 class="marvel-title">PERFIL DE USUARIO</h1>
        <p class="profile-subtitle">Configuración de tu cuenta Marvel</p>
      </div>

      <!-- Información del usuario -->
      <div class="user-info">
        <h3>Información Personal</h3>
        <div class="info-grid">
          <div class="info-item">
            <label>Nombre Completo:</label>
            <span>{{ authStore.user?.fullName }}</span>
          </div>
          <div class="info-item">
            <label>Email:</label>
            <span>{{ authStore.user?.email }}</span>
          </div>
          <div class="info-item">
            <label>Rol:</label>
            <span class="role-badge" :class="authStore.user?.role === 1 ? 'admin' : 'user'">
              {{ authStore.user?.roleText }}
            </span>
          </div>
        </div>
      </div>

      <!-- Configuración 2FA -->
      <div class="twofa-section">
        <h3>Autenticación de Dos Factores (2FA)</h3>
        
        <!-- Estado actual del 2FA -->
        <div class="twofa-status">
          <div class="status-indicator" :class="{ active: authStore.has2FAEnabled }">
            <div class="status-dot"></div>
            <span v-if="authStore.has2FAEnabled">2FA Activado</span>
            <span v-else>2FA Desactivado</span>
          </div>
        </div>

        <!-- Si 2FA no está activado -->
        <div v-if="!authStore.has2FAEnabled" class="setup-2fa">
          <p>Protege tu cuenta con autenticación de dos factores usando Google Authenticator o similar.</p>
          
          <!-- Paso 1: Generar QR -->
          <div v-if="!qrCode" class="setup-step">
            <button @click="setup2FA" class="setup-btn" :disabled="loading">
              <span v-if="loading">Generando...</span>
              <span v-else>Configurar 2FA</span>
            </button>
          </div>

          <!-- Paso 2: Mostrar QR y activar -->
          <div v-if="qrCode" class="qr-section">
            <div class="qr-steps">
              <h4>Pasos para activar 2FA:</h4>
              <ol>
                <li>Descarga Google Authenticator o similar</li>
                <li>Escanea este código QR:</li>
              </ol>
            </div>
            
            <div class="qr-code">
              <img :src="qrCode" alt="QR Code para 2FA" />
            </div>

            <div class="manual-code" v-if="manualKey">
              <p><strong>Código manual:</strong></p>
              <code>{{ manualKey }}</code>
            </div>

            <form @submit.prevent="enable2FA" class="verify-form">
              <div class="form-group">
                <label for="verifyCode">Ingresa el código de 6 dígitos:</label>
                <input
                  id="verifyCode"
                  v-model="verifyCode"
                  type="text"
                  required
                  maxlength="6"
                  pattern="[0-9]{6}"
                  placeholder="123456"
                  class="code-input"
                  :disabled="loading"
                />
              </div>

              <div class="button-group">
                <button type="submit" class="enable-btn" :disabled="loading">
                  <span v-if="loading">Activando...</span>
                  <span v-else>Activar 2FA</span>
                </button>
                <button type="button" class="cancel-btn" @click="cancelSetup" :disabled="loading">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Si 2FA está activado -->
        <div v-if="authStore.has2FAEnabled" class="disable-2fa">
          <p>Tu cuenta está protegida con 2FA. Para desactivarlo, ingresa tu contraseña:</p>
          
          <form @submit.prevent="disable2FA" class="disable-form">
            <div class="form-group">
              <label for="currentPassword">Contraseña actual:</label>
              <input
                id="currentPassword"
                v-model="currentPassword"
                type="password"
                required
                placeholder="Tu contraseña"
                :disabled="loading"
              />
            </div>

            <button type="submit" class="disable-btn" :disabled="loading">
              <span v-if="loading">Desactivando...</span>
              <span v-else>Desactivar 2FA</span>
            </button>
          </form>
        </div>
      </div>

      <!-- Mensajes -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <div v-if="success" class="success-message">
        {{ success }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../authStore'
import { authService } from '../authService'

const authStore = useAuthStore()

// Estados reactivos
const loading = ref(false)
const error = ref('')
const success = ref('')
const qrCode = ref('')
const manualKey = ref('')
const verifyCode = ref('')
const currentPassword = ref('')

// Limpiar mensajes
const clearMessages = () => {
  error.value = ''
  success.value = ''
}

// Configurar 2FA (generar QR)
const setup2FA = async () => {
  loading.value = true
  clearMessages()
  
  try {
    const response = await authService.setup2FA()
    qrCode.value = response.qrCode
    manualKey.value = response.manualKey
    
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Activar 2FA (verificar código)
const enable2FA = async () => {
  loading.value = true
  clearMessages()
  
  try {
    const response = await authService.enable2FA(verifyCode.value)
    success.value = response.message || '2FA activado correctamente'
    
    // Actualizar estado del usuario
    if (authStore.user) {
      authStore.user.twoFactorEnabled = true
    }
    
    // Limpiar formulario
    cancelSetup()
    
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Desactivar 2FA
const disable2FA = async () => {
  loading.value = true
  clearMessages()
  
  try {
    const response = await authService.disable2FA(currentPassword.value)
    success.value = response.message || '2FA desactivado correctamente'
    
    // Actualizar estado del usuario
    if (authStore.user) {
      authStore.user.twoFactorEnabled = false
    }
    
    currentPassword.value = ''
    
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Cancelar configuración
const cancelSetup = () => {
  qrCode.value = ''
  manualKey.value = ''
  verifyCode.value = ''
  clearMessages()
}
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #0c1421 0%, #1a252f 100%);
}

.profile-card {
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 2px solid #e23636;
}

.profile-header {
  text-align: center;
  margin-bottom: 40px;
}

.marvel-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #e23636;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 2px;
}

.profile-subtitle {
  color: #666;
  margin: 10px 0 0 0;
  font-size: 1.1rem;
}

.user-info, .twofa-section {
  margin-bottom: 40px;
  padding: 30px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  border-left: 4px solid #e23636;
}

.user-info h3, .twofa-section h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.4rem;
}

.info-grid {
  display: grid;
  gap: 15px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.info-item label {
  font-weight: 600;
  color: #555;
}

.role-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
}

.role-badge.admin {
  background: #ff6b6b;
  color: white;
}

.role-badge.user {
  background: #51cf66;
  color: white;
}

.twofa-status {
  margin-bottom: 30px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  border-radius: 8px;
  background: #f8f9fa;
}

.status-indicator.active {
  background: rgba(81, 207, 102, 0.1);
  border: 1px solid #51cf66;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ff6b6b;
}

.status-indicator.active .status-dot {
  background: #51cf66;
}

.setup-2fa p, .disable-2fa p {
  color: #666;
  margin-bottom: 20px;
  line-height: 1.6;
}

.setup-btn, .enable-btn {
  background: linear-gradient(45deg, #e23636, #ff4444);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.setup-btn:hover:not(:disabled), .enable-btn:hover:not(:disabled) {
  background: linear-gradient(45deg, #cc2929, #e23636);
  transform: translateY(-2px);
}

.qr-section {
  text-align: center;
}

.qr-steps {
  margin-bottom: 20px;
  text-align: left;
}

.qr-steps ol {
  color: #666;
  padding-left: 20px;
}

.qr-code {
  background: white;
  padding: 20px;
  border-radius: 8px;
  display: inline-block;
  margin: 20px 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.qr-code img {
  display: block;
}

.manual-code {
  margin: 20px 0;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.manual-code code {
  background: #e9ecef;
  padding: 8px 12px;
  border-radius: 4px;
  font-family: monospace;
  word-break: break-all;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.form-group input {
  width: 100%;
  max-width: 300px;
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
}

.code-input {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 4px;
}

.button-group {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
}

.cancel-btn, .disable-btn {
  background: transparent;
  color: #666;
  border: 2px solid #ddd;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.disable-btn {
  color: #e23636;
  border-color: #e23636;
}

.cancel-btn:hover:not(:disabled), .disable-btn:hover:not(:disabled) {
  border-color: #999;
  color: #333;
}

.disable-btn:hover:not(:disabled) {
  background: rgba(226, 54, 54, 0.1);
}

.error-message, .success-message {
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
  text-align: center;
}

.error-message {
  background: rgba(226, 54, 54, 0.1);
  border: 1px solid #e23636;
  color: #e23636;
}

.success-message {
  background: rgba(81, 207, 102, 0.1);
  border: 1px solid #51cf66;
  color: #2d8f3f;
}

/* Responsive */
@media (max-width: 768px) {
  .profile-card {
    padding: 20px;
  }
  
  .marvel-title {
    font-size: 2rem;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .button-group {
    flex-direction: column;
  }
}
</style>