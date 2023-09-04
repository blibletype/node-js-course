const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

const isAuth = require('../middleware/isAuth');

router.get('/products', isAuth, adminController.getProducts);
router.get('/add-product', isAuth, adminController.getAddProduct);
router.post('/add-product', isAuth, adminController.postAddProduct);
router.get('/edit-product/:id', isAuth, adminController.getEditProduct);
router.post('/edit-product', isAuth, adminController.postEditProduct);
router.post('/delete-product', isAuth, adminController.deleteProduct);

module.exports = router;
