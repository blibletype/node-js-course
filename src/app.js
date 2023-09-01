const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const PORT = process.env.PORT || 3000
const app = express()
app.set('view engine', 'pug')
app.set('views', './src/views')

const { mongoConnect } = require('./utils/database')
const User = require('./models/user')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const errorController = require('./controllers/errorController')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  User.findById('64f1f01a9223eef6b99b8c23')
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

mongoConnect(() => {
  app.listen(PORT)
  // const user = new User('blibletype', 'maxymkoval2510@gmail.com')
  // user.save()
  console.log(`app listening at http://localhost:${PORT}`)
})
