require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path');
const csrf = require('csurf')();
const flash = require('connect-flash');
const multer = require('multer');

const PORT = process.env.PORT || 3000;
const app = express();

const store = new MongoDBStore({
  uri: process.env.DB_URI,
  collection: 'sessions',
});

const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './src/images');
  },
  filename: (req, file, callback) => {
    callback(
      null,
      new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname
    );
  },
});

const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg'
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

app.set('view engine', 'pug');
app.set('views', './src/views');

const mongoose = require('mongoose');
const User = require('./models/user');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/errorController');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('imageUrl')
);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/src/images', express.static(path.join(__dirname, 'images')));

app.use(
  session({
    secret: 'kUngiMh4#ng.bH4Ngl',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrf);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuth = req.session.user;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(async (req, res, next) => {
  try {
    if (!req.session.user) return next();
    req.user = await User.findById(req.session.user._id);
    next();
  } catch (error) {
    return next(error);
  }
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.getPageNotFound);

app.use(errorController.getInternalServerError);

mongoose.connect(process.env.DB_URI).then(() => {
  app.listen(PORT);
  console.log(`app listening at http://localhost:${PORT}`);
});
