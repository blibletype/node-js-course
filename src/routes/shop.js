const express = require('express');

const router = express.Router();
const shopController = require('../controllers/shopController');

const isAuth = require('../middleware/isAuth');

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:id', shopController.getProduct);
router.get('/cart', isAuth, shopController.getCart);
router.post('/cart', isAuth, shopController.postCart);
router.post('/cart-remove-item', isAuth, shopController.postRemoveCartItem);
router.get('/orders', isAuth, shopController.getOrders);
router.post('/create-order', isAuth, shopController.postOrder);
// router.get('/checkout', shopController.getCheckout)

module.exports = router;
