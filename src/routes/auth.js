const express = require('express');
const { check, body } = require('express-validator');

const router = express.Router();
const authController = require('../controllers/authController');

const isAuth = require('../middleware/isAuth');

router.get('/signin', authController.getSignIn);

router.post(
  '/signin',
  body('email').isEmail().normalizeEmail(),
  authController.postSignIn
);

router.post('/signout', isAuth, authController.postSignOut);

router.get('/signup', authController.getSignUp);

router.post(
  '/signup',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).trim(),
  body('passwordConfirmation')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('invalid input');
      }
      return true;
    }),
  authController.postSignUp
);

router.get('/reset', authController.getReset);

router.post(
  '/reset',
  body('email').isEmail().normalizeEmail(),
  authController.postReset
);

router.get('/reset/:token', authController.getNewPassword);

router.post(
  '/new-password',
  body('password').isLength({ min: 8 }).trim(),
  authController.postNewPassword
);

module.exports = router;
