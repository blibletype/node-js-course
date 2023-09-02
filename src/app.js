const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const PORT = process.env.PORT || 3000;
const app = express();
app.set('view engine', 'pug');
app.set('views', './src/views');

const { mongoConnect } = require('./utils/database');
const mongoose = require('mongoose');
const User = require('./models/user');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/errorController');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('64f1f01a9223eef6b99b8c23')
    .then((user) => {
      const { username, email, cart, _id } = user;
      req.user = new User(username, email, cart, _id);
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.pageNotFound);

mongoose
  .connect(
    'mongodb+srv://max:123456789000@node-course.ooytjw9.mongodb.net/shop?retryWrites=true&w=majority'
  )
  .then(() => {
    app.listen(PORT);
    console.log(`app listening at http://localhost:${PORT}`);
  });
