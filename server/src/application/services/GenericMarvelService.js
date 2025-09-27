const { MarvelApiClient } = require('../../infrastructure/external/MarvelApiClient')

// Servicio genérico - Maneja los casos de uso para Comics, Characters y Stories
class GenericMarvelService {
  constructor() {
    this.marvelApiClient = new MarvelApiClient()
    
    // Configuración de entidades soportadas
    this.entityConfig = {
      comics: {
        getAllMethod: 'getAllComics',
        getByIdMethod: 'getComicById',
        name: 'comic',
        pluralName: 'comics'
      },
      characters: {
        getAllMethod: 'getAllCharacters',
        getByIdMethod: 'getCharacterById', 
        name: 'character',
        pluralName: 'characters'
      },
      stories: {
        getAllMethod: 'getAllStories',
        getByIdMethod: 'getStoryById',
        name: 'story', 
        pluralName: 'stories'
      }
    }
  }

  // Caso de uso genérico: Obtener todas las entidades de un tipo
  async getAllEntities(entityType, limit = 20, offset = 0, searchParams = {}) {
    const config = this.entityConfig[entityType]
    if (!config) {
      throw new Error(`Tipo de entidad no soportado: ${entityType}`)
    }

    try {
      const methodName = config.getAllMethod
      const entities = await this.marvelApiClient[methodName](limit, offset, searchParams)
      return entities
    } catch (error) {
      throw new Error(`Error al obtener ${config.pluralName}: ${error.message}`)
    }
  }

  // Caso de uso genérico: Obtener entidad por ID
  async getEntityById(entityType, id) {
    const config = this.entityConfig[entityType]
    if (!config) {
      throw new Error(`Tipo de entidad no soportado: ${entityType}`)
    }

    if (!id || isNaN(parseInt(id))) {
      throw new Error(`ID de ${config.name} inválido`)
    }

    try {
      const methodName = config.getByIdMethod
      const entity = await this.marvelApiClient[methodName](id)
      return entity
    } catch (error) {
      throw new Error(`Error al obtener ${config.name}: ${error.message}`)
    }
  }
}

module.exports = { GenericMarvelService }