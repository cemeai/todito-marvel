const { Client } = require('pg');
const { config } = require('../config/config');

class DatabaseConnection {
  constructor() {
    this.connection = null;
  }

  async connect() {
    try {
      // Always use connection string if available for Supabase
      const connectionConfig = config.database.connectionString 
        ? { connectionString: config.database.connectionString, ssl: { rejectUnauthorized: false } }
        : {
            host: config.database.host,
            user: config.database.user,
            password: config.database.password,
            database: config.database.name,
            port: config.database.port || 5432,
            ssl: config.database.ssl || { rejectUnauthorized: false }
          };

      this.connection = new Client(connectionConfig);
      
      await this.connection.connect();
      console.log('Conectado a PostgreSQL (Supabase) exitosamente');
      return this.connection;
    } catch (error) {
      console.error('Error conectando a PostgreSQL:', error.message);
      throw error;
    }
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.end();
      console.log('Desconectado de PostgreSQL');
    }
  }

  getConnection() {
    return this.connection;
  }
}

// Singleton para una sola conexión global
let dbInstance = null;

const getDatabase = async () => {
  if (!dbInstance) {
    dbInstance = new DatabaseConnection();
    await dbInstance.connect();
  }
  return dbInstance;
};

module.exports = { getDatabase, DatabaseConnection };