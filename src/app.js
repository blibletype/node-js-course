require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const PORT = process.env.PORT || 3000;
const app = express();
app.set('view engine', 'pug');
app.set('views', './src/views');

const mongoose = require('mongoose');
const User = require('./models/user');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/errorController');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('64f355e3a55a23136d364c19')
    .then((user) => {
      req.user = user || null;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.pageNotFound);

mongoose.connect(process.env.DB_URI).then(() => {
  // User.create({
  //   username: 'blibletype',
  //   email: 'maxymkoval2510@gmail.com',
  //   cart: {
  //     items: [],
  //   },
  // });
  app.listen(PORT);
  console.log(`app listening at http://localhost:${PORT}`);
});
