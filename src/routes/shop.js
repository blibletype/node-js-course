const express = require('express')

const router = express.Router()
const shopController = require('../controllers/shopController')

router.get('/', shopController.getIndex)
router.get('/products', shopController.getProducts)
router.get('/products/:id', shopController.getProduct)
router.get('/cart', shopController.getCart)
router.post('/cart', shopController.postCart)
router.post('/cart-remove-item', shopController.postRemoveCartItem)
router.get('/orders', shopController.getOrders)
router.post('/create-order', shopController.postOrder)
router.get('/checkout', shopController.getCheckout)

module.exports = router
