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
const Cart = require('./models/cart')
const CartItem = require('./models/cartItem')
const Order = require('./models/order')
const OrderItem = require('./models/orderItem')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user
      next()
    })
    .catch((err) => {
      console.log(err)
    })
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.pageNotFound)

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' })
User.hasMany(Product)
User.hasOne(Cart)
Cart.belongsTo(User)
Cart.belongsToMany(Product, { through: CartItem })
Product.belongsToMany(Cart, { through: CartItem })
Order.belongsTo(User)
User.hasMany(Order)
Order.belongsToMany(Product, { through: OrderItem })

sequelize
  .sync()
  .then(() => {
    return User.findByPk(1)
  })
  .then((user) => {
    if (!user) {
      return User.create({
        username: 'blibletype',
        email: 'maxymkoval2510@gmail.com',
      })
    }
    return user
  })
  // .then((user) => {
  //   return user.createCart()
  // })
  .then(() => {
    app.listen(PORT)
  })
  .catch((err) => {
    console.log(err)
  })
