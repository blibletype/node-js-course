const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

let _db

const mongoConnect = (callback) => {
  MongoClient.connect(
    'mongodb+srv://max:123456789000@node-course.ooytjw9.mongodb.net/shop?retryWrites=true&w=majority'
  )
    .then((client) => {
      console.log('Successfully connected to DB')
      _db = client.db()
      callback()
    })
    .catch((err) => {
      console.log(err)
    })
}

const getDB = () => {
  if (_db) {
    return _db
  }
  throw new Error("Can't connet to DB")
}

exports.mongoConnect = mongoConnect
exports.getDB = getDB
