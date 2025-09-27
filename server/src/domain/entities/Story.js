// Entidad Story - Representa el modelo de negocio de historias
class Story {
  constructor(id, title, description, imageUrl = null) {
    this.id = id
    this.title = title
    this.description = description
    this.imageUrl = imageUrl
  }

  // Formatear para mostrar
  getDisplayTitle() {
    return this.title || 'Historia sin título'
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

module.exports = { Story }