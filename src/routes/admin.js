const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { body } = require('express-validator');

const isAuth = require('../middleware/isAuth');

router.get('/products', isAuth, adminController.getProducts);

router.get('/add-product', isAuth, adminController.getAddProduct);

router.post(
  '/add-product',
  isAuth,
  body('title').isLength({ min: 2, max: 30 }).trim(),
  body('price').isNumeric(),
  body('description').isLength({ min: 2 }).trim(),
  adminController.postAddProduct
);

router.get('/edit-product/:id', isAuth, adminController.getEditProduct);

router.post(
  '/edit-product',
  isAuth,
  body('title').isLength({ min: 2, max: 30 }).trim(),
  body('price').isNumeric(),
  body('description').isLength({ min: 2 }).trim(),
  adminController.postEditProduct
);

router.delete('/product/:id', isAuth, adminController.deleteProduct);

module.exports = router;
