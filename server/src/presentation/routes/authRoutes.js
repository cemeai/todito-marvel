const { AuthController } = require('../controllers/AuthController');
const { AuthService } = require('../../application/services/AuthService');

// Middleware para verificar JWT
const verifyJWT = async (request, reply) => {
    try {
        const token = request.headers.authorization?.split(' ')[1];
        
        if (!token) {
            reply.code(401).send({ error: 'Token requerido' });
            return;
        }

        const verification = AuthService.verifyJWT(token);
        if (!verification.valid) {
            reply.code(403).send({ error: 'Token inválido o expirado' });
            return;
        }

        request.user = verification.data;
    } catch (error) {
        reply.code(401).send({ error: 'Token inválido' });
    }
};

// Middleware para verificar rol de administrador
const requireAdmin = async (request, reply) => {
    if (request.user.role !== 1) { // 1 = admin
        reply.code(403).send({ error: 'Acceso denegado. Se requiere rol de administrador.' });
        return;
    }
};

// Función para registrar todas las rutas de autenticación
async function authRoutes(fastify, options) {
    // ===== SCHEMAS DE VALIDACIÓN =====
    const loginSchema = {
        body: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
                email: { type: 'string', format: 'email' },
                password: { type: 'string', minLength: 6 }
            }
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    token: { type: 'string' },
                    user: { type: 'object' },
                    requires2FA: { type: 'boolean' }
                }
            }
        }
    }

    const registerSchema = {
        body: {
            type: 'object',
            required: ['email', 'password', 'fullName'],
            properties: {
                email: { type: 'string', format: 'email' },
                password: { type: 'string', minLength: 6 },
                fullName: { type: 'string', minLength: 2 }
            }
        }
    }

    // Rutas públicas (sin autenticación)
    fastify.post('/register', { schema: registerSchema }, AuthController.register);
    fastify.post('/login', { schema: loginSchema }, AuthController.login);
    fastify.post('/verify-2fa', AuthController.verify2FA);
    fastify.post('/logout', AuthController.logout);

    // Rutas protegidas con JWT
    fastify.register(async function (fastify) {
        fastify.addHook('preHandler', verifyJWT);
        
        fastify.get('/profile', AuthController.getProfile);
        fastify.post('/setup-2fa', AuthController.setup2FA);
        fastify.post('/enable-2fa', AuthController.enable2FA);
        fastify.post('/disable-2fa', AuthController.disable2FA);
    });

    // Rutas de administrador
    fastify.register(async function (fastify) {
        fastify.addHook('preHandler', verifyJWT);
        fastify.addHook('preHandler', requireAdmin);
        
        fastify.get('/users', AuthController.getUsers);
    });
}

module.exports = authRoutes;