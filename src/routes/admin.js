const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')

router.get('/add-product', adminController.getAddProduct)
router.get('/products', adminController.getProducts)
router.post('/add-product', adminController.postAddProduct)
router.get('/edit-product/:id', adminController.getEditProduct)
router.post('/edit-product', adminController.postEditProduct)
router.post('/delete-product', adminController.deleteProduct)

module.exports = router
