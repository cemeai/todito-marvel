require('dotenv').config()

// Configuración centralizada de la aplicación
const config = {
  server: {
    port: process.env.PORT || 3000,
    host: '0.0.0.0',
    environment: process.env.NODE_ENV || 'development'
  },
  
  marvel: {
    publicKey: process.env.MARVEL_PUBLIC_KEY,
    privateKey: process.env.MARVEL_PRIVATE_KEY,
    baseUrl: 'https://gateway.marvel.com/v1/public',
    timeout: 10000,
    defaultLimit: 20
  },

  database: {
    connectionString: process.env.DATABASE_URL,
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'postgres',
    port: process.env.DB_PORT || 5432,
    ssl: process.env.DB_HOST && process.env.DB_HOST.includes('supabase.co') ? { rejectUnauthorized: false } : false
  },

  auth: {
    jwtSecret: process.env.JWT_SECRET || 'super-secret-key-shhhh',
    jwtExpiration: process.env.JWT_EXPIRATION || '7d',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 10
  },

  cors: {
    // Configuración dinámica para desarrollo y producción
    origins: process.env.NODE_ENV === 'production' 
      ? (process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [
          'https://todito-marvel-frontend.onrender.com',
          'https://todito-marvel-client.onrender.com',
          'https://todito-marvel.netlify.app',
          'https://todito-marvel.vercel.app',
          'http://localhost:5173',
          'http://localhost:3000'
        ])
      : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173']
  },

  security: {
    rateLimit: {
      max: process.env.NODE_ENV === 'production' ? 60 : 100, // Más estricto en producción
      timeWindow: '1 minute'
    }
  }
}

module.exports = { config }