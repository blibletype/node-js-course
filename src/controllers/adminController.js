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
  Product.findByPk(productId)
    .then((product) => {
      if (!product) return res.redirect('/')
      res.render('admin/edit-product', {
        docTitle: 'Edit product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.postEditProduct = async (req, res) => {
  const { id, title, price, description, imageUrl } = req.body
  const product = await Product.findByPk(id)
  product.title = title
  product.price = price
  product.description = description
  product.imageUrl = imageUrl
  product
    .save()
    .then(() => {
      res.redirect('/admin/products')
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.postAddProduct = (req, res) => {
  const { title, price, description, imageUrl } = req.body
  Product.create({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
  })
    .then(() => {
      res.redirect('/products')
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.deleteProduct = (req, res) => {
  const { id } = req.body
  Product.destroy({ where: { id: id } })
    .then(() => {
      res.redirect('/products')
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.getProducts = (req, res) => {
  Product.findAll()
    .then((products) => {
      res.render('admin/products', {
        products: products,
        docTitle: 'Products',
        path: '/admin/products',
      })
    })
    .catch((err) => {
      console.log(err)
    })
}
