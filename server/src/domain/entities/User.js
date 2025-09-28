const bcrypt = require('bcrypt');
const fileStorage = require('../../infrastructure/storage/FileStorage');
const { config } = require('../../infrastructure/config/config');

class User {
  constructor(id, email, passwordHash, fullName, role = 2, twoFactorSecret = null, twoFactorEnabled = false, isActive = true) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.fullName = fullName;
    this.role = role; // 1=admin, 2=user
    this.twoFactorSecret = twoFactorSecret;
    this.twoFactorEnabled = twoFactorEnabled;
    this.isActive = isActive;
  }

  // Create User instance from file data
  static fromData(userData) {
    return new User(
      userData.id,
      userData.email,
      userData.password_hash,
      userData.full_name,
      userData.role,
      userData.two_factor_secret,
      userData.two_factor_enabled,
      userData.is_active
    );
  }

  // Crear nuevo usuario
  static async create(userData) {
    const { email, password, fullName, role = 2 } = userData; // Default role = user
    
    // Hash del password
    const passwordHash = await bcrypt.hash(password, config.auth.bcryptRounds);
    
    try {
      const newUser = await fileStorage.createUser({
        email,
        password_hash: passwordHash,
        full_name: fullName,
        role
      });
      
      console.log(`Usuario creado con ID: ${newUser.id}`);
      return User.fromData(newUser);
      
    } catch (error) {
      console.error('Error creando usuario:', error.message);
      throw error;
    }
  }

  // Buscar usuario por email
  static async findByEmail(email) {
    try {
      const userData = await fileStorage.findUserByEmail(email);
      
      if (!userData) {
        return null;
      }
      
      return User.fromData(userData);
      
    } catch (error) {
      console.error('Error buscando usuario por email:', error.message);
      throw new Error('Error al buscar usuario');
    }
  }

  // Buscar usuario por ID
  static async findById(id) {
    try {
      const db = await getDatabase();
      const connection = db.getConnection();
      
      const result = await connection.query(
        'SELECT * FROM users WHERE id = $1 AND is_active = TRUE',
        [id]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const userData = result.rows[0];
      return new User(
        userData.id,
        userData.email,
        userData.password_hash,
        userData.full_name,
        userData.role,
        userData.two_factor_secret,
        userData.two_factor_enabled,
        userData.is_active
      );
      
    } catch (error) {
      console.error('Error buscando usuario por ID:', error.message);
      throw new Error('Error al buscar usuario');
    }
  }

  // Validar password
  async validatePassword(password) {
    try {
      return await bcrypt.compare(password, this.passwordHash);
    } catch (error) {
      console.error('Error validando password:', error.message);
      return false;
    }
  }

  // Activar/Desactivar 2FA
  async update2FA(secret, enabled = true) {
    try {
      const db = await getDatabase();
      const connection = db.getConnection();
      
      await connection.query(
        'UPDATE users SET two_factor_secret = $1, two_factor_enabled = $2 WHERE id = $3',
        [secret, enabled, this.id]
      );
      
      this.twoFactorSecret = secret;
      this.twoFactorEnabled = enabled;
      
      console.log(`2FA ${enabled ? 'activado' : 'desactivado'} para usuario ${this.email}`);
      return true;
      
    } catch (error) {
      console.error('Error actualizando 2FA:', error.message);
      throw new Error('Error al actualizar configuración 2FA');
    }
  }

  // Obtener datos sin información sensible
  toSafeObject() {
    return {
      id: this.id,
      email: this.email,
      fullName: this.fullName,
      role: this.role,
      roleText: this.role === 1 ? 'admin' : 'user',
      twoFactorEnabled: this.twoFactorEnabled,
      isActive: this.isActive
    };
  }

  // Listar todos los usuarios (admin only)
  static async findAll(limit = 50) {
    try {
      const db = await getDatabase();
      const connection = db.getConnection();
      
      const result = await connection.query(
        'SELECT id, email, full_name, role, two_factor_enabled, is_active, created_at FROM users ORDER BY created_at DESC LIMIT $1',
        [limit]
      );
      
      return result.rows.map(userData => ({
        id: userData.id,
        email: userData.email,
        fullName: userData.full_name,
        role: userData.role === 1 ? 'admin' : 'user',
        twoFactorEnabled: userData.two_factor_enabled,
        isActive: userData.is_active,
        createdAt: userData.created_at
      }));
      
    } catch (error) {
      console.error('Error listando usuarios:', error.message);
      throw new Error('Error al obtener lista de usuarios');
    }
  }
}

module.exports = { User };