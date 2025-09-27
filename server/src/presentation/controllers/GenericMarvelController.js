const { GenericMarvelService } = require('../../application/services/GenericMarvelService')

// Controlador genérico - Maneja las peticiones HTTP para Comics, Characters y Stories
class GenericMarvelController {
  constructor() {
    this.marvelService = new GenericMarvelService()
  }

  // GET /api/:entityType (comics, characters, stories)
  async getAllEntities(request, reply) {
    try {
      const { entityType } = request.params
      const { 
        offset = 0, 
        limit = 20, 
        titleStartsWith,
        nameStartsWith 
      } = request.query
      
      // Convertir a números
      const numericOffset = parseInt(offset) || 0
      const numericLimit = parseInt(limit) || 20
      
      // Parámetros de búsqueda
      const searchParams = {}
      if (titleStartsWith) searchParams.titleStartsWith = titleStartsWith
      if (nameStartsWith) searchParams.nameStartsWith = nameStartsWith
      
      const entities = await this.marvelService.getAllEntities(
        entityType, 
        numericLimit, 
        numericOffset,
        searchParams
      )
      
      return {
        success: true,
        data: entities,
        total: entities.length,
        entityType: entityType,
        pagination: {
          offset: numericOffset,
          limit: numericLimit,
          count: entities.length
        }
      }
    } catch (error) {
      reply.status(500)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // GET /api/:entityType/:id
  async getEntityById(request, reply) {
    try {
      const { entityType, id } = request.params
      const entity = await this.marvelService.getEntityById(entityType, id)
      
      return {
        success: true,
        data: entity,
        entityType: entityType
      }
    } catch (error) {
      reply.status(404)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Métodos específicos para mantener compatibilidad con rutas existentes
  async getAllComics(request, reply) {
    request.params = { entityType: 'comics' }
    return this.getAllEntities(request, reply)
  }

  async getComicById(request, reply) {
    const { id } = request.params
    request.params = { entityType: 'comics', id }
    return this.getEntityById(request, reply)
  }

  async getAllCharacters(request, reply) {
    request.params = { entityType: 'characters' }
    return this.getAllEntities(request, reply)
  }

  async getCharacterById(request, reply) {
    const { id } = request.params
    request.params = { entityType: 'characters', id }
    return this.getEntityById(request, reply)
  }

  async getAllStories(request, reply) {
    request.params = { entityType: 'stories' }
    return this.getAllEntities(request, reply)
  }

  async getStoryById(request, reply) {
    const { id } = request.params
    request.params = { entityType: 'stories', id }
    return this.getEntityById(request, reply)
  }
}

module.exports = { GenericMarvelController }