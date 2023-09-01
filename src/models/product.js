const { ObjectId } = require('mongodb')
const { getDB } = require('../utils/database')

class Product {
  constructor(title, price, imageUrl, description, id, userId) {
    this.title = title
    this.price = price
    this.imageUrl = imageUrl
    this.description = description
    this._id = id ? new ObjectId(id) : null
    this.userId = userId
  }

  save() {
    const db = getDB()
    let dbOp
    if (this._id) {
      dbOp = db
        .collection('products')
        .updateOne({ _id: this._id }, { $set: this })
    } else {
      dbOp = db.collection('products').insertOne(this)
    }
    return dbOp
      .then((result) => {
        console.log(result)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  static destroy(id) {
    const db = getDB()
    return db
      .collection('products')
      .deleteOne({ _id: new ObjectId(id) })
      .then((result) => {})
      .catch((err) => {
        console.log(err)
      })
  }

  static fetchAll() {
    const db = getDB()
    return db
      .collection('products')
      .find()
      .toArray()
      .then((products) => {
        return products
      })
      .catch((err) => {
        console.log(err)
      })
  }

  static findById(id) {
    const db = getDB()
    return db
      .collection('products')
      .find({ _id: new ObjectId(id) })
      .next()
      .then((product) => {
        return product
      })
      .catch((err) => {
        console.log(err)
      })
  }
}

module.exports = Product
