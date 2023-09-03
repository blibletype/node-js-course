const Product = require('../models/product');
const Order = require('../models/order');

exports.getIndex = (req, res) => {
  res.render('shop/index', {
    docTitle: 'Home',
    path: '/',
    isAuth: req.session.user,
  });
};

exports.getProducts = (req, res) => {
  Product.find()
    .then((products) => {
      res.render('shop/products', {
        products: products,
        docTitle: 'Shop',
        path: '/products',
        isAuth: req.session.user,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res) => {
  const { id } = req.params;
  Product.findById(id)
    .then((product) => {
      res.render('shop/product-detail', {
        docTitle: product.title,
        product: product,
        path: '/products',
        isAuth: req.session.user,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res) => {
  req.user.populate('cart.items.product').then((user) => {
    res.render('shop/cart', {
      items: user.cart.items,
      docTitle: 'Cart',
      path: '/cart',
      isAuth: req.session.user,
    });
  });
};

exports.postCart = (req, res) => {
  const { id } = req.body;
  Product.findById(id)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect('/cart');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postRemoveCartItem = (req, res) => {
  const { id } = req.body;
  req.user
    .removeItemFromCart(id)
    .then(() => {
      res.redirect('/cart');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrders = (req, res) => {
  Order.find({ user: req.session.user })
    .populate('items.product')
    .then((orders) => {
      res.render('shop/orders', {
        docTitle: 'Orders',
        path: '/orders',
        orders: orders,
        isAuth: req.session.user,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postOrder = (req, res) => {
  Order.create({
    items: req.user.cart.items,
    user: req.user,
  })
    .then(() => {
      req.user.cart.items = [];
      return req.user.save();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCheckout = (req, res) => {
  res.render('shop/checkout', {
    docTitle: 'Checkout',
    path: '/checkout',
    isAuth: req.session.user,
  });
};
