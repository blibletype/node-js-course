const Product = require('../models/product')
const Cart = require('../models/cart')

exports.getIndex = (req, res) => {
  res.render('shop/index', {
    docTitle: 'Home',
    path: '/',
  })
}

exports.getProducts = (req, res) => {
  Product.findAll()
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
  const id = req.params.id
  Product.findByPk(id)
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
  const cartProducts = []
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      for (product of products) {
        const cartProductData = cart.products.find((prod) => {
          return prod.id === product.id
        })
        if (cartProductData) {
          cartProducts.push({
            productData: product,
            quantity: cartProductData.quantity,
          })
        }
      }
      res.render('shop/cart', {
        products: cartProducts,
        docTitle: 'Cart',
        path: '/cart',
      })
    })
  })
}

exports.postCart = (req, res) => {
  const id = req.body.id
  Product.getProductById(id, (product) => {
    Cart.addProduct(id, product.price)
  })
  res.redirect('/cart')
}

exports.postRemoveCartItem = (req, res) => {
  const { id } = req.body
  Product.getProductById(id, (product) => {
    Cart.deleteProduct(id, product.price)
    res.redirect('/cart')
  })
}

exports.getOrders = (req, res) => {
  res.render('shop/orders', {
    docTitle: 'Orders',
    path: '/orders',
  })
}

exports.getCheckout = (req, res) => {
  res.render('shop/checkout', {
    docTitle: 'Checkout',
    path: '/checkout',
  })
}
