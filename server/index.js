const fastify = require('fastify')({ logger: true })
const marvelRoutes = require('./src/presentation/routes/marvelRoutes')
const authRoutes = require('./src/presentation/routes/authRoutes')
const { config } = require('./src/infrastructure/config/config')

// ===== SECURITY PLUGINS =====
// Helmet - Security headers
fastify.register(require('@fastify/helmet'), {
  contentSecurityPolicy: false // Permitir contenido dinámico de Marvel API
})

// Rate limiting - Prevenir abuse
fastify.register(require('@fastify/rate-limit'), {
  max: config.security.rateLimit.max,
  timeWindow: config.security.rateLimit.timeWindow
})

// Compression - Optimizar respuestas
fastify.register(require('@fastify/compress'))

// CORS - Configuración centralizada
fastify.register(require('@fastify/cors'), {
  origin: config.cors.origins,
  credentials: true
})

// Registrar las rutas genéricas de Marvel API
fastify.register(marvelRoutes, { prefix: '/api' })

// Registrar las rutas de autenticación
fastify.register(authRoutes, { prefix: '/auth' })

// Health check endpoint - GET / (información del servidor)
fastify.get('/', async (request, reply) => {
  return { 
    message: 'Marvel Comics API - Backend funcionando!',
    version: '1.0.0',
    architecture: 'Layered Architecture',
    endpoints: {
      // Marvel API
      getAllEntities: '/api/:entityType (comics, characters, stories)',
      getEntityById: '/api/:entityType/:id',
      // Authentication
      register: 'POST /auth/register',
      login: 'POST /auth/login',
      verify2FA: 'POST /auth/verify-2fa',
      setup2FA: 'POST /auth/setup-2fa (protected)',
      profile: 'GET /auth/profile (protected)',
      users: 'GET /auth/users (admin only)'
    }
  }
})

// Función para iniciar el servidor
const start = async () => {
  try {
    await fastify.listen({ port: config.server.port, host: config.server.host })
    console.log(`Servidor corriendo en http://localhost:${config.server.port}`)
    console.log(`API Comics disponible en http://localhost:${config.server.port}/api/comics`)
    console.log(`Arquitectura en Capas implementada`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()