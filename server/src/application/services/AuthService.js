const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { User } = require('../../domain/entities/User');
const { config } = require('../../infrastructure/config/config');

// Servicio de autenticación con 2FA
class AuthService {
  
  // Registro de nuevo usuario
  static async register(userData) {
    const { email, password, fullName, role = 2 } = userData;

    // Validaciones básicas
    if (!email || !password || !fullName) {
      throw new Error('Email, password y nombre completo son requeridos');
    }

    if (password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    try {
      // Verificar que el email no existe
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        throw new Error('El email ya está registrado');
      }

      // Crear usuario
      const user = await User.create({ email, password, fullName, role });
      
      console.log(`Usuario registrado: ${email}`);
      return {
        success: true,
        user: user.toSafeObject(),
        message: 'Usuario creado exitosamente'
      };

    } catch (error) {
      console.error('Error en registro:', error.message);
      throw error;
    }
  }

  // Login - Paso 1: Validar email y password
  static async login(email, password) {
    if (!email || !password) {
      throw new Error('Email y contraseña son requeridos');
    }

    try {
      // Buscar usuario
      const user = await User.findByEmail(email);
      if (!user) {
        throw new Error('Credenciales inválidas');
      }

      // Validar contraseña
      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword) {
        throw new Error('Credenciales inválidas');
      }

      // Si el usuario tiene 2FA habilitado, requerir código
      if (user.twoFactorEnabled) {
        return {
          success: true,
          requires2FA: true,
          userId: user.id, // Para el siguiente paso
          message: 'Ingresa tu código de 2FA'
        };
      }

      // Si no tiene 2FA, generar token directamente
      const token = AuthService.generateJWT(user);
      
      console.log(`Login exitoso: ${email}`);
      return {
        success: true,
        requires2FA: false,
        token,
        user: user.toSafeObject(),
        message: 'Login exitoso'
      };

    } catch (error) {
      console.error('Error en login:', error.message);
      throw error;
    }
  }

  // Login - Paso 2: Verificar código 2FA
  static async verify2FA(userId, code) {
    if (!userId || !code) {
      throw new Error('ID de usuario y código 2FA son requeridos');
    }

    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      if (!user.twoFactorEnabled || !user.twoFactorSecret) {
        throw new Error('2FA no está configurado para este usuario');
      }

      // Verificar código TOTP
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: code,
        window: 2 // Permite códigos de ±2 períodos (60 segundos)
      });

      if (!verified) {
        throw new Error('Código 2FA inválido o expirado');
      }

      // Generar JWT token
      const token = AuthService.generateJWT(user);

      console.log(`2FA verificado para: ${user.email}`);
      return {
        success: true,
        token,
        user: user.toSafeObject(),
        message: 'Autenticación 2FA exitosa'
      };

    } catch (error) {
      console.error('Error en verificación 2FA:', error.message);
      throw error;
    }
  }

  // Configurar 2FA - Generar secreto y QR
  static async setup2FA(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Generar secreto único
      const secret = speakeasy.generateSecret({
        name: `Todito Marvel App (${user.email})`,
        issuer: 'Todito Marvel App',
        length: 32
      });

      // Guardar secreto (pero no habilitar aún)
      await user.update2FA(secret.base32, false);

      // Generar código QR
      const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

      console.log(`2FA configurado para: ${user.email}`);
      return {
        success: true,
        secret: secret.base32,
        qrCode: qrCodeUrl,
        manualEntry: secret.otpauth_url,
        message: 'Escanea el código QR con Google Authenticator'
      };

    } catch (error) {
      console.error('Error configurando 2FA:', error.message);
      throw error;
    }
  }

  // Activar 2FA después de verificar el primer código
  static async enable2FA(userId, code) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.twoFactorSecret) {
        throw new Error('Configuración 2FA no encontrada');
      }

      // Verificar código antes de activar
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: code,
        window: 2
      });

      if (!verified) {
        throw new Error('Código 2FA inválido. No se pudo activar 2FA');
      }

      // Activar 2FA
      await user.update2FA(user.twoFactorSecret, true);

      console.log(`2FA activado para: ${user.email}`);
      return {
        success: true,
        message: '2FA activado exitosamente'
      };

    } catch (error) {
      console.error('Error activando 2FA:', error.message);
      throw error;
    }
  }

  // Desactivar 2FA
  static async disable2FA(userId, password) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar contraseña para desactivar 2FA
      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword) {
        throw new Error('Contraseña incorrecta');
      }

      // Desactivar 2FA
      await user.update2FA(null, false);

      console.log(`2FA desactivado para: ${user.email}`);
      return {
        success: true,
        message: '2FA desactivado exitosamente'
      };

    } catch (error) {
      console.error('Error desactivando 2FA:', error.message);
      throw error;
    }
  }

  // Generar JWT Token
  static generateJWT(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000)
    };

    return jwt.sign(payload, config.auth.jwtSecret, {
      expiresIn: config.auth.jwtExpiration
    });
  }

  // Verificar JWT Token
  static verifyJWT(token) {
    try {
      const decoded = jwt.verify(token, config.auth.jwtSecret);
      return { valid: true, data: decoded };
    } catch (error) {
      console.error('Token inválido:', error.message);
      return { valid: false, error: error.message };
    }
  }

  // Middleware para validar token en rutas protegidas
  static authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token de acceso requerido'
      });
    }

    const verification = AuthService.verifyJWT(token);
    if (!verification.valid) {
      return res.status(403).json({
        success: false,
        error: 'Token inválido o expirado'
      });
    }

    req.user = verification.data;
    next();
  }

  // Middleware para rutas que requieren rol admin
  static requireAdmin(req, res, next) {
    if (req.user.role !== 1) {
      return res.status(403).json({
        success: false,
        error: 'Acceso denegado. Se requiere rol de administrador'
      });
    }
    next();
  }
}

module.exports = { AuthService };