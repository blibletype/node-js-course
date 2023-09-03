const express = require('express');

const router = express.Router();
const authController = require('../controllers/authController');

router.get('/signin', authController.getSignIn);
router.post('/signin', authController.postSignIn);

module.exports = router;
