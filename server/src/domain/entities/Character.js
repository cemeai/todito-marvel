// Entidad Character - Representa el modelo de negocio de personajes
class Character {
  constructor(id, name, description, imageUrl = null) {
    this.id = id
    this.name = name
    this.description = description
    this.imageUrl = imageUrl
  }

  // Formatear para mostrar
  getDisplayName() {
    return this.name || 'Personaje sin nombre'
  }

  getShortDescription() {
    if (!this.description || this.description.trim() === '' || this.description === 'Descripción no disponible') {
      return 'Sin descripción disponible'
    }
    return this.description.length > 150 
      ? this.description.substring(0, 150) + '...' 
      : this.description
  }
}

module.exports = { Character }