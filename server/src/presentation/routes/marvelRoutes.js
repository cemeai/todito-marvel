const { GenericMarvelController } = require('../controllers/GenericMarvelController')

// Rutas genéricas para Marvel API - Configuración de endpoints
async function marvelRoutes(fastify, options) {
  const marvelController = new GenericMarvelController()
  
  // ===== SCHEMAS DE VALIDACIÓN =====
  const getAllEntitiesSchema = {
    params: {
      type: 'object',
      required: ['entityType'],
      properties: {
        entityType: { 
          type: 'string', 
          enum: ['comics', 'characters', 'stories'] 
        }
      }
    },
    querystring: {
      type: 'object',
      properties: {
        limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
        offset: { type: 'integer', minimum: 0, default: 0 },
        search: { type: 'string', minLength: 1, maxLength: 100 }
      }
    }
  }

  const getEntityByIdSchema = {
    params: {
      type: 'object',
      required: ['entityType', 'id'],
      properties: {
        entityType: { 
          type: 'string', 
          enum: ['comics', 'characters', 'stories'] 
        },
        id: { type: 'integer', minimum: 1 }
      }
    }
  }
  
  // GET /api/:entityType - Obtener todas las entidades (comics, characters, stories)
  fastify.get('/:entityType', { schema: getAllEntitiesSchema }, async (request, reply) => {
    return marvelController.getAllEntities(request, reply)
  })
  
  // GET /api/:entityType/:id - Obtener entidad por ID
  fastify.get('/:entityType/:id', { schema: getEntityByIdSchema }, async (request, reply) => {
    return marvelController.getEntityById(request, reply)
  })
}

module.exports = marvelRoutes