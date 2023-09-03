const express = require('express');

const router = express.Router();
const authController = require('../controllers/authController');

const isAuth = require('../middleware/isAuth');

router.get('/signin', authController.getSignIn);
router.post('/signin', authController.postSignIn);
router.post('/signout', isAuth, authController.postSignOut);
router.get('/signup', authController.getSignUp);
router.post('/signup', authController.postSignUp);

module.exports = router;
