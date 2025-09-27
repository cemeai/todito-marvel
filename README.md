# 🦸‍♂️ Marvel Universe Explorer

Una aplicación web completa para explorar el universo Marvel, construida con **Node.js + Fastify** en el backend y **Vue.js + TypeScript** en el frontend.

![Marvel Logo](https://upload.wikimedia.org/wikipedia/commons/b/b9/Marvel_Logo.svg)

## 🚀 Características

### ✨ Frontend (Vue.js + TypeScript)
- **🏗️ Arquitectura DDD** - Domain Driven Design
- **🔍 Búsqueda en tiempo real** - Server-side search con Marvel API
- **♾️ Scroll infinito** - Paginación automática (9 elementos por carga)
- **🎨 Interfaz Modal** - Sistema de modales consistente
- **🛡️ Router Guards** - Protección de rutas autenticadas

### 🔧 Backend (Node.js + Fastify)
- **🏗️ Arquitectura en Capas** - Presentación, Aplicación, Dominio, Infraestructura
- **🔐 Autenticación completa** - JWT + bcrypt + 2FA (TOTP)
- **📊 Base de datos** - MariaDB con entidades relacionales
- **🛡️ Seguridad OWASP** - Rate limiting, Helmet, validación de schemas
- **📈 API Optimizada** - Compresión gzip, validación automática

### 🦸‍♂️ Dominios Marvel
- **📚 Comics** - Explorar cómics de Marvel
- **👥 Characters** - Descubrir personajes icónicos  
- **📖 Stories** - Leer historias épicas

## 🛠️ Tecnologías

### Frontend
- **Vue.js 3** - Framework progresivo
- **TypeScript** - Tipado estático
- **Pinia** - State management
- **Vue Router** - Enrutamiento SPA
- **Vite** - Build tool ultrarrápido

### Backend
- **Node.js** - Runtime de JavaScript
- **Fastify** - Framework web de alto rendimiento
- **MariaDB** - Base de datos relacional
- **JWT** - Autenticación sin estado
- **Speakeasy** - 2FA TOTP

## 📋 Prerrequisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MariaDB/MySQL** >= 10.6
- **Cuenta Marvel API** - [Registrarse aquí](https://developer.marvel.com)

## ⚡ Instalación Rápida

### 1. Clonar el repositorio
```bash
git clone <tu-repo-url>
cd marvel-universe-explorer
```

### 2. Configurar Backend
```bash
cd server
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales
```

### 3. Configurar Base de Datos
```bash
# Ejecutar en MariaDB/MySQL
mysql -u root -p < database_setup.sql
```

### 4. Configurar Frontend
```bash
cd ../client
npm install
```

### 5. Ejecutar en Desarrollo
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

## 🔧 Configuración

### Variables de Entorno (.env)

```properties
# Marvel API (obtener en https://developer.marvel.com)
MARVEL_PUBLIC_KEY=tu_clave_publica
MARVEL_PRIVATE_KEY=tu_clave_privada

# Base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=marvel_app

# Autenticación
JWT_SECRET=tu_clave_secreta_muy_segura
```

### Base de Datos

El archivo `database_setup.sql` crea automáticamente:
- Tabla `users` con soporte para 2FA
- Usuario administrador por defecto
- Índices optimizados

## 🚀 Scripts Disponibles

### Backend
```bash
npm start          # Producción
npm run dev        # Desarrollo con nodemon
```

### Frontend
```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build para producción
npm run preview    # Vista previa del build
```

## 🏗️ Arquitectura

### Backend - Arquitectura en Capas
```
server/src/
├── presentation/     # Controllers + Routes
├── application/      # Services + Business Logic  
├── domain/          # Entities + Domain Rules
└── infrastructure/  # Database + External APIs
```

### Frontend - Domain Driven Design
```
client/src/domains/
├── auth/           # Autenticación
├── comics/         # Dominio Comics
├── characters/     # Dominio Characters
└── stories/        # Dominio Stories
```

## 🛡️ Seguridad (OWASP)

### Implementado
- ✅ **A1: Broken Access Control** - Roles y permisos JWT
- ✅ **A2: Cryptographic Failures** - bcrypt + JWT secrets
- ✅ **A5: Security Misconfiguration** - Helmet + CORS
- ✅ **A7: Auth Failures** - 2FA + JWT + Session management
- ✅ **A10: SSRF** - Validación de requests externos

## 📊 API Endpoints

### Autenticación
```
POST /auth/register     # Registro de usuario
POST /auth/login        # Login (paso 1)
POST /auth/verify-2fa   # Verificar 2FA (paso 2)
POST /auth/setup-2fa    # Configurar 2FA
GET  /auth/profile      # Perfil del usuario
```

### Marvel API
```
GET /api/comics         # Obtener comics
GET /api/characters     # Obtener personajes
GET /api/stories        # Obtener historias
GET /api/:type/:id      # Obtener por ID
```

### Parámetros de búsqueda
```
?limit=20          # Elementos por página (1-100)
?offset=0          # Desplazamiento
?search=spider     # Término de búsqueda
```

## 🎨 Características UI/UX

- **🎨 Tema Marvel** - Colores oficiales (#ED1D24)
- **📱 Responsive** - Diseño adaptable
- **♾️ Infinite Scroll** - Carga automática
- **🔍 Search** - Búsqueda instantánea
- **🖼️ Modales** - Vista de detalles elegante
- **🔄 Loading States** - Feedback visual

## 🚀 Despliegue

### Variables de Producción
```bash
NODE_ENV=production
PORT=3000
# Configurar CORS para tu dominio
# Usar HTTPS en producción
```

### Consideraciones
- Configurar CORS para tu dominio
- Usar HTTPS en producción
- Configurar variables de entorno del servidor
- Optimizar base de datos para producción

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📝 Licencia

Proyecto educativo - Marvel API utilizada bajo sus términos de servicio.

## 👨‍💻 Autor

**Tu Nombre** - [GitHub](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- **Marvel Comics** - Por su increíble API
- **Vue.js Team** - Por el excelente framework
- **Fastify Team** - Por el framework backend performante