import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './domains/auth/authStore'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Inicializar authStore con datos de localStorage
const authStore = useAuthStore()
authStore.initialize()

app.mount('#app')
