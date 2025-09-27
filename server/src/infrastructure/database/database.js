const mysql = require('mysql2/promise');
const { config } = require('../config/config');

class DatabaseConnection {
  constructor() {
    this.connection = null;
  }

  async connect() {
    try {
      this.connection = await mysql.createConnection({
        host: config.database.host,
        user: config.database.user,
        password: config.database.password,
        database: config.database.name,
        port: config.database.port || 3306
      });
      
      console.log('Conectado a MariaDB exitosamente');
      return this.connection;
    } catch (error) {
      console.error('Error conectando a MariaDB:', error.message);
      throw error;
    }
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.end();
      console.log('Desconectado de MariaDB');
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