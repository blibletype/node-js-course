const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const PORT = process.env.PORT || 3000
const app = express()
app.set('view engine', 'pug')
app.set('views', './src/views')

const mongoConnect = require('./utils/database')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const errorController = require('./controllers/errorController')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  // User.findByPk(1)
  //   .then((user) => {
  //     req.user = user
  //     next()
  //   })
  //   .catch((err) => {
  //     console.log(err)
  //   })
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.pageNotFound)

app.listen(PORT)
