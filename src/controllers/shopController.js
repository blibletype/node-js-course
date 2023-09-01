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
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts()
    })
    .then((products) => {
      res.render('shop/cart', {
        products: products,
        docTitle: 'Cart',
        path: '/cart',
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.postCart = (req, res) => {
  const { id } = req.body
  let fetchedCart
  let newQuantity = 1
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart
      return cart.getProducts({ where: { id: id } })
    })
    .then((products) => {
      let product
      if (products.length > 0) {
        product = products[0]
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity
        newQuantity = oldQuantity + 1
      }
      return Product.findByPk(id)
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      })
    })
    .then(() => {
      res.redirect('/cart')
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.postRemoveCartItem = (req, res) => {
  const { id } = req.body
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: id } })
    })
    .then((products) => {
      const product = products[0]
      return product.cartItem.destroy()
    })
    .then(() => {
      res.redirect('/cart')
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.getOrders = (req, res) => {
  req.user
    .getOrders({ include: ['products'] })
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
  let fetchedCart
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart
      return cart.getProducts()
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) => {
          return order.addProducts(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity }
              return product
            })
          )
        })
        .catch((err) => {
          console.log(err)
        })
    })
    .then(() => {
      return fetchedCart.setProducts(null)
    })
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
