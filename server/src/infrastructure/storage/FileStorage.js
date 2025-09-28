const fs = require('fs').promises;
const path = require('path');

class FileStorage {
  constructor() {
    this.dataPath = path.join(__dirname, '..', '..', '..', 'data');
    this.usersFile = path.join(this.dataPath, 'users.json');
  }

  async ensureDataDir() {
    try {
      await fs.access(this.dataPath);
    } catch {
      await fs.mkdir(this.dataPath, { recursive: true });
    }
  }

  async readUsers() {
    try {
      await this.ensureDataDir();
      const data = await fs.readFile(this.usersFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, return default structure
        return { users: [] };
      }
      throw error;
    }
  }

  async writeUsers(data) {
    try {
      await this.ensureDataDir();
      await fs.writeFile(this.usersFile, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
      console.error('Error writing users file:', error);
      throw error;
    }
  }

  async findUserByEmail(email) {
    const data = await this.readUsers();
    return data.users.find(user => user.email === email && user.is_active);
  }

  async findUserById(id) {
    const data = await this.readUsers();
    return data.users.find(user => user.id === id && user.is_active);
  }

  async createUser(userData) {
    const data = await this.readUsers();
    
    // Check if email exists
    const existingUser = data.users.find(user => user.email === userData.email);
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Generate new ID
    const newId = data.users.length > 0 ? Math.max(...data.users.map(u => u.id)) + 1 : 1;
    
    const newUser = {
      id: newId,
      email: userData.email,
      password_hash: userData.password_hash,
      full_name: userData.full_name,
      role: userData.role || 2,
      two_factor_secret: null,
      two_factor_enabled: false,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    data.users.push(newUser);
    await this.writeUsers(data);
    
    return newUser;
  }

  async updateUser(id, updateData) {
    const data = await this.readUsers();
    const userIndex = data.users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      throw new Error('Usuario no encontrado');
    }

    data.users[userIndex] = {
      ...data.users[userIndex],
      ...updateData,
      updated_at: new Date().toISOString()
    };

    await this.writeUsers(data);
    return data.users[userIndex];
  }

  async getAllUsers(limit = 50) {
    const data = await this.readUsers();
    return data.users
      .filter(user => user.is_active)
      .slice(0, limit)
      .map(user => ({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role === 1 ? 'admin' : 'user',
        two_factor_enabled: user.two_factor_enabled,
        is_active: user.is_active,
        created_at: user.created_at
      }));
  }
}

module.exports = new FileStorage();