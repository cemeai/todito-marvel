// Entidad Comic - Representa el modelo de negocio
class Comic {
  constructor(id, title, description, price, date, imageUrl = null) {
    this.id = id
    this.title = title
    this.description = description
    this.price = price
    this.date = date
    this.imageUrl = imageUrl
  }

  getFormattedPrice() {
    return `$${this.price.toFixed(2)}`
  }

}

module.exports = { Comic }