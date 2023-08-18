const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const PORT = process.env.PORT || 3000
const app = express()
app.set('view engine', 'pug')
app.set('views', './src/views')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const errorController = require('./controllers/errorController')

const sequelize = require('./utils/database')
const User = require('./models/user')
const Product = require('./models/product')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.pageNotFound)

Product.belongsTo(User)

sequelize
  .sync()
  .then(() => {
    app.listen(PORT)
  })
  .catch((err) => {
    console.log(err)
  })
