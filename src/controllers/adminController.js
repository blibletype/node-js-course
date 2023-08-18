const Product = require('../models/product')
const Cart = require('../models/cart')

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    docTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  })
}

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit
  if (!editMode) return res.redirect('/')
  const productId = req.params.id
  Product.getProductById(productId, (product) => {
    if (!product) return res.redirect('/')
    res.render('admin/edit-product', {
      docTitle: 'Edit product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product,
    })
  })
}

exports.postEditProduct = (req, res) => {
  const { id, title, price, description, imageUrl } = req.body
  const updatedProduct = new Product(id, title, price, description, imageUrl)
  updatedProduct.save()
  res.redirect('/admin/products')
}

exports.postAddProduct = (req, res) => {
  const { title, price, description, imageUrl } = req.body
  const product = new Product(null, title, price, description, imageUrl)
  product.save()
  res.redirect('/products')
}

exports.deleteProduct = (req, res) => {
  const { id } = req.body
  Product.deleteById(id)
  res.redirect('/products')
}

exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render('admin/products', {
      products: products,
      docTitle: 'Products',
      path: '/admin/products',
    })
  })
}
