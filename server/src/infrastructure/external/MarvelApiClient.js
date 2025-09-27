const axios = require('axios')
const CryptoJS = require('crypto-js')
const { Comic } = require('../../domain/entities/Comic')
const { Character } = require('../../domain/entities/Character')
const { Story } = require('../../domain/entities/Story')
const { config } = require('../config/config')

// Cliente de la API real de Marvel
class MarvelApiClient {
  constructor() {
    // Configuración de API
    this.publicKey = config.marvel.publicKey
    this.privateKey = config.marvel.privateKey
    this.baseUrl = config.marvel.baseUrl
    this.timeout = config.marvel.timeout
    this.defaultLimit = config.marvel.defaultLimit
  }

  // Genera los parámetros de autenticación requeridos por Marvel
  generateAuthParams() {
    const timestamp = Date.now()
    const hash = CryptoJS.MD5(timestamp + this.privateKey + this.publicKey).toString()
    
    return {
      ts: timestamp,
      apikey: this.publicKey,
      hash: hash
    }
  }

  // Obtiene todos los comics desde la API real de Marvel
  async getAllComics(limit = this.defaultLimit, offset = 0, searchParams = {}) {
    try {
      console.log(`Obteniendo comics desde Marvel API... (limit: ${limit}, offset: ${offset})`)
      
      const authParams = this.generateAuthParams()
      const requestParams = {
        ...authParams,
        limit: limit,
        offset: offset,
        format: 'comic',
        formatType: 'comic',
        orderBy: '-onsaleDate'
      }

      // Agregar parámetros de búsqueda si existen
      if (searchParams.titleStartsWith) {
        requestParams.titleStartsWith = searchParams.titleStartsWith
        console.log(`Buscando comics que empiecen con: ${searchParams.titleStartsWith}`)
      }

      const response = await axios.get(`${this.baseUrl}/comics`, {
        params: requestParams,
        timeout: this.timeout // Configuración centralizada
      })

      const marvelComics = response.data.data.results
      console.log(`Obtenidos ${marvelComics.length} comics de Marvel API`)
      
      /* Mostrar datos crudos del primer comic para debug
      if (marvelComics.length > 0) {
        console.log('DATOS CRUDOS DEL PRIMER COMIC:')
        console.log(JSON.stringify(marvelComics[0], null, 2))
      }*/

      // Convertir respuesta de Marvel a nuestras entidades de dominio
      return marvelComics.map(marvelComic => 
        new Comic(
          marvelComic.id,
          marvelComic.title,
          marvelComic.textObjects?.[0]?.text || 'Descripción no disponible',
          marvelComic.prices?.[0]?.price || 0,
          marvelComic.dates?.find(d => d.type === 'onsaleDate')?.date || null,
          marvelComic.thumbnail ? `${marvelComic.thumbnail.path}.${marvelComic.thumbnail.extension}` : null
        )
      )
    } catch (error) {
      console.error('Error al obtener comics de Marvel API:', error.message)
      throw new Error(`Marvel API no disponible: ${error.message}`)
    }
  }

  // Obtiene un comic específico por ID desde Marvel API
  async getComicById(id) {
    try {
      console.log(`Obteniendo comic ${id} desde Marvel API...`)
      
      const authParams = this.generateAuthParams()
      const response = await axios.get(`${this.baseUrl}/comics/${id}`, {
        params: authParams,
        timeout: this.timeout
      })

      const marvelComic = response.data.data.results[0]
      if (!marvelComic) {
        throw new Error('Comic not found')
      }

      console.log(`Comic ${id} obtenido de Marvel API`)

      return new Comic(
        marvelComic.id,
        marvelComic.title,
        marvelComic.textObjects?.[0]?.text || 'Descripción no disponible',
        marvelComic.prices?.[0]?.price || 0,
        marvelComic.dates?.find(d => d.type === 'onsaleDate')?.date || null,
        marvelComic.thumbnail ? `${marvelComic.thumbnail.path}.${marvelComic.thumbnail.extension}` : null
      )
    } catch (error) {
      console.error(`Error al obtener comic ${id} de Marvel API:`, error.message)
      throw new Error('Comic not found')
    }
  }

  // Obtiene todos los personajes desde la API real de Marvel
  async getAllCharacters(limit = this.defaultLimit, offset = 0, searchParams = {}) {
    try {
      console.log(`Obteniendo characters desde Marvel API... (limit: ${limit}, offset: ${offset})`)
      
      const authParams = this.generateAuthParams()
      const requestParams = {
        ...authParams,
        limit: limit,
        offset: offset,
        orderBy: 'name'
      }

      // Agregar parámetros de búsqueda si existen
      if (searchParams.nameStartsWith) {
        requestParams.nameStartsWith = searchParams.nameStartsWith
        console.log(`Buscando characters que empiecen con: ${searchParams.nameStartsWith}`)
      }

      const response = await axios.get(`${this.baseUrl}/characters`, {
        params: requestParams,
        timeout: this.timeout
      })

      const marvelCharacters = response.data.data.results
      console.log(`Obtenidos ${marvelCharacters.length} characters de Marvel API`)
      
      /* Mostrar datos crudos del primer character para debug
      if (marvelCharacters.length > 0) {
        console.log('DATOS CRUDOS DEL PRIMER CHARACTER:')
        console.log(JSON.stringify(marvelCharacters[0], null, 2))
      }*/

      // Convertir respuesta de Marvel a nuestras entidades de dominio
      return marvelCharacters.map(marvelCharacter => 
        new Character(
          marvelCharacter.id,
          marvelCharacter.name,
          marvelCharacter.description || 'Descripción no disponible',
          marvelCharacter.thumbnail ? `${marvelCharacter.thumbnail.path}.${marvelCharacter.thumbnail.extension}` : null
        )
      )
    } catch (error) {
      console.error('Error al obtener characters de Marvel API:', error.message)
      throw new Error(`Marvel API no disponible: ${error.message}`)
    }
  }

  // Obtiene un personaje específico por ID desde Marvel API
  async getCharacterById(id) {
    try {
      console.log(`Obteniendo character ${id} desde Marvel API...`)
      
      const authParams = this.generateAuthParams()
      const response = await axios.get(`${this.baseUrl}/characters/${id}`, {
        params: authParams,
        timeout: this.timeout
      })

      const marvelCharacter = response.data.data.results[0]
      if (!marvelCharacter) {
        throw new Error('Character not found')
      }

      console.log(`Character ${id} obtenido de Marvel API`)

      return new Character(
        marvelCharacter.id,
        marvelCharacter.name,
        marvelCharacter.description || 'Descripción no disponible',
        marvelCharacter.thumbnail ? `${marvelCharacter.thumbnail.path}.${marvelCharacter.thumbnail.extension}` : null
      )
    } catch (error) {
      console.error(`Error al obtener character ${id} de Marvel API:`, error.message)
      throw new Error('Character not found')
    }
  }

  // Obtiene todas las historias desde la API real de Marvel
  async getAllStories(limit = this.defaultLimit, offset = 0, searchParams = {}) {
    try {
      console.log(`Obteniendo stories desde Marvel API... (limit: ${limit}, offset: ${offset})`)
      
      const authParams = this.generateAuthParams()
      const requestParams = {
        ...authParams,
        limit: limit,
        offset: offset,
        orderBy: '-modified'
      }

      // Agregar parámetros de búsqueda si existen
      if (searchParams.titleStartsWith) {
        requestParams.titleStartsWith = searchParams.titleStartsWith
        console.log(`Buscando stories que empiecen con: ${searchParams.titleStartsWith}`)
      }

      const response = await axios.get(`${this.baseUrl}/series`, {
        params: requestParams,
        timeout: this.timeout
      })

      const marvelStories = response.data.data.results
      console.log(`Obtenidos ${marvelStories.length} stories de Marvel API`)
      
      /* Mostrar datos crudos de la primera story para debug
      if (marvelStories.length > 0) {
        console.log('DATOS CRUDOS DE LA PRIMERA STORY:')
        console.log(JSON.stringify(marvelStories[0], null, 2))
      }*/

      // Convertir respuesta de Marvel a nuestras entidades de dominio
      return marvelStories.map(marvelStory => 
        new Story(
          marvelStory.id,
          marvelStory.title,
          marvelStory.description || 'Descripción no disponible',
          marvelStory.thumbnail ? `${marvelStory.thumbnail.path}.${marvelStory.thumbnail.extension}` : null
        )
      )
    } catch (error) {
      console.error('Error al obtener stories de Marvel API:', error.message)
      throw new Error(`Marvel API no disponible: ${error.message}`)
    }
  }

  // Obtiene una historia específica por ID desde Marvel API
  async getStoryById(id) {
    try {
      console.log(`Obteniendo story ${id} desde Marvel API...`)
      
      const authParams = this.generateAuthParams()
      const response = await axios.get(`${this.baseUrl}/stories/${id}`, {
        params: authParams,
        timeout: this.timeout
      })

      const marvelStory = response.data.data.results[0]
      if (!marvelStory) {
        throw new Error('Story not found')
      }

      console.log(`Story ${id} obtenido de Marvel API`)

      return new Story(
        marvelStory.id,
        marvelStory.title,
        marvelStory.description || 'Descripción no disponible',
        marvelStory.thumbnail ? `${marvelStory.thumbnail.path}.${marvelStory.thumbnail.extension}` : null
      )
    } catch (error) {
      console.error(`Error al obtener story ${id} de Marvel API:`, error.message)
      throw new Error('Story not found')
    }
  }
}

module.exports = { MarvelApiClient }