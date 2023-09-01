const Product = require('../models/product')

exports.getIndex = (req, res) => {
  res.render('shop/index', {
    docTitle: 'Home',
    path: '/',
  })
}

exports.getProducts = (req, res) => {
  Product.fetchAll()
    .then((products) => {
      res.render('shop/products', {
        products: products,
        docTitle: 'Shop',
        path: '/products',
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.getProduct = (req, res) => {
  const { id } = req.params
  Product.findById(id)
    .then((product) => {
      res.render('shop/product-detail', {
        docTitle: product.title,
        product: product,
        path: '/products',
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.getCart = (req, res) => {
  req.user.getCart().then((products) => {
    res.render('shop/cart', {
      products: products,
      docTitle: 'Cart',
      path: '/cart',
    })
  })
}

exports.postCart = (req, res) => {
  const { id } = req.body
  Product.findById(id)
    .then((product) => {
      return req.user.addToCart(product)
    })
    .then((result) => {
      res.redirect('/cart')
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.postRemoveCartItem = (req, res) => {
  const { id } = req.body
  req.user
    .removeItemFromCart(id)
    .then(() => {
      res.redirect('/cart')
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.getOrders = (req, res) => {
  req.user
    .getOrders()
    .then((orders) => {
      res.render('shop/orders', {
        docTitle: 'Orders',
        path: '/orders',
        orders: orders,
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.postOrder = (req, res) => {
  req.user
    .createOrder()
    .then(() => {
      res.redirect('/orders')
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.getCheckout = (req, res) => {
  res.render('shop/checkout', {
    docTitle: 'Checkout',
    path: '/checkout',
  })
}
