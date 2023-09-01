const { ObjectId } = require('mongodb')
const { getDB } = require('../utils/database')

class User {
  constructor(username, email, cart) {
    this.username = username
    this.email = email
    this.cart = cart
  }

  save() {
    const db = getDB()
    return db.collection('users').insertOne(this)
  }

  static findById(id) {
    const db = getDB()
    return db.collection('users').findOne({ _id: new ObjectId(id) })
  }
}

module.exports = User
