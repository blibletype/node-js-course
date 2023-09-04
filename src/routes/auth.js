const express = require('express');

const router = express.Router();
const authController = require('../controllers/authController');

const isAuth = require('../middleware/isAuth');

router.get('/signin', authController.getSignIn);
router.post('/signin', authController.postSignIn);
router.post('/signout', isAuth, authController.postSignOut);
router.get('/signup', authController.getSignUp);
router.post('/signup', authController.postSignUp);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;
