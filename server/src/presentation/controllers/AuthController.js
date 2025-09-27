const { AuthService } = require('../../application/services/AuthService');

// Controlador para autenticación
class AuthController {
  
  // POST /auth/register - Registro de usuarios
  static async register(request, reply) {
    try {
      const { email, password, fullName, role } = request.body;
      
      const result = await AuthService.register({ 
        email, 
        password, 
        fullName, 
        role: role || 2 // Default: user role
      });
      
      reply.code(201).send(result);
      
    } catch (error) {
      console.error('Error en register endpoint:', error.message);
      reply.code(400).send({
        success: false,
        error: error.message
      });
    }
  }

  // POST /auth/login - Login paso 1 (email + password)
  static async login(request, reply) {
    try {
      const { email, password } = request.body;
      
      const result = await AuthService.login(email, password);
      
      if (result.requires2FA) {
        reply.code(200).send(result);
      } else {
        // Login completo sin 2FA
        reply.code(200).send(result);
      }
      
    } catch (error) {
      console.error('Error en login endpoint:', error.message);
      reply.code(401).send({
        success: false,
        error: error.message
      });
    }
  }

  // POST /auth/verify-2fa - Login paso 2 (código 2FA)
  static async verify2FA(request, reply) {
    try {
      const { userId, code } = request.body;
      
      const result = await AuthService.verify2FA(userId, code);
      
      reply.code(200).send(result);
      
    } catch (error) {
      console.error('Error en verify-2fa endpoint:', error.message);
      reply.code(401).send({
        success: false,
        error: error.message
      });
    }
  }

  // POST /auth/setup-2fa - Configurar 2FA (generar QR)
  static async setup2FA(request, reply) {
    try {
      const userId = request.user.userId; // Del JWT token
      
      const result = await AuthService.setup2FA(userId);
      
      reply.code(200).send(result);
      
    } catch (error) {
      console.error('Error en setup-2fa endpoint:', error.message);
      reply.code(500).send({
        success: false,
        error: error.message
      });
    }
  }

  // POST /auth/enable-2fa - Activar 2FA (verificar primer código)
  static async enable2FA(request, reply) {
    try {
      const userId = request.user.userId; // Del JWT token
      const { code } = request.body;
      
      const result = await AuthService.enable2FA(userId, code);
      
      reply.code(200).send(result);
      
    } catch (error) {
      console.error('Error en enable-2fa endpoint:', error.message);
      reply.code(400).send({
        success: false,
        error: error.message
      });
    }
  }

  // POST /auth/disable-2fa - Desactivar 2FA
  static async disable2FA(request, reply) {
    try {
      const userId = request.user.userId; // Del JWT token
      const { password } = request.body;
      
      const result = await AuthService.disable2FA(userId, password);
      
      reply.code(200).send(result);
      
    } catch (error) {
      console.error('Error en disable-2fa endpoint:', error.message);
      reply.code(400).send({
        success: false,
        error: error.message
      });
    }
  }

  // GET /auth/profile - Obtener perfil del usuario
  static async getProfile(request, reply) {
    try {
      const { User } = require('../../domain/entities/User');
      const user = await User.findById(request.user.userId);
      
      if (!user) {
        return reply.code(404).send({
          success: false,
          error: 'Usuario no encontrado'
        });
      }
      
      reply.code(200).send({
        success: true,
        user: user.toSafeObject()
      });
      
    } catch (error) {
      console.error('Error en profile endpoint:', error.message);
      reply.code(500).send({
        success: false,
        error: 'Error al obtener perfil'
      });
    }
  }

  // POST /auth/logout - Cerrar sesión
  static async logout(request, reply) {
    try {
      
      reply.code(200).send({
        success: true,
        message: 'Sesión cerrada exitosamente'
      });
      
    } catch (error) {
      console.error('Error en logout endpoint:', error.message);
      reply.code(500).send({
        success: false,
        error: 'Error al cerrar sesión'
      });
    }
  }

  // GET /auth/users - Listar usuarios (solo admins)
  static async getUsers(request, reply) {
    try {
      const { User } = require('../../domain/entities/User');
      const users = await User.findAll();
      
      reply.code(200).send({
        success: true,
        users: users,
        count: users.length
      });
      
    } catch (error) {
      console.error('Error en users endpoint:', error.message);
      reply.code(500).send({
        success: false,
        error: 'Error al obtener usuarios'
      });
    }
  }
}

module.exports = { AuthController };