const fs = require('fs')
const path = require('path')
const Cart = require('./cart')
const { v4: uuidv4 } = require('uuid')
const p = path.join(
  path.dirname(require.main.filename),
  'data',
  'products.json'
)

const getProductsFromFile = (callback) => {
  fs.readFile(p, (error, data) => {
    if (error) {
      callback([])
    }
    callback(JSON.parse(data))
  })
}

module.exports = class Product {
  constructor(id, title, price, description, imageUrl) {
    this.id = id
    this.title = title
    this.price = price
    this.description = description
    this.imageUrl = imageUrl
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (product) => product.id === this.id
        )
        const updatedProducts = [...products]
        updatedProducts[existingProductIndex] = this
        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          console.log(err)
        })
      } else {
        this.id = uuidv4()
        products.push(this)
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err)
        })
      }
    })
  }

  static deleteById(id) {
    getProductsFromFile((products) => {
      const product = products.find((product) => {
        return product.id === id
      })
      const updatedProducts = products.filter((product) => {
        return product.id !== id
      })
      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        if (err) return
        Cart.deleteProduct(id, product.price)
      })
    })
  }

  static fetchAll(callback) {
    getProductsFromFile(callback)
  }

  static getProductById(id, callback) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id)
      callback(product)
    })
  }
}
