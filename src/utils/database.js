const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const mongoConnect = (callback) => {
  MongoClient.connect(
    'mongodb+srv://max:123456789000@node-course.ooytjw9.mongodb.net/?retryWrites=true&w=majority'
  )
    .then((client) => {
      console.log('Successfully connected to DB')
      callback(client)
    })
    .catch((err) => {
      console.log(err)
    })
}

module.exports = mongoConnect
