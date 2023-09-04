const Product = require('../models/product');
const Order = require('../models/order');

exports.getIndex = (req, res) => {
  res.render('shop/index', {
    docTitle: 'Home',
    path: '/',
  });
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.render('shop/products', {
      products: products,
      docTitle: 'Shop',
      path: '/products',
    });
  } catch (error) {
    console.error(error);
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('shop/product-detail', {
      docTitle: product.title,
      product: product,
      path: '/products',
    });
  } catch (error) {
    console.error(error);
  }
};

exports.getCart = async (req, res) => {
  try {
    const user = await req.user.populate('cart.items.product');
    res.render('shop/cart', {
      items: user.cart.items,
      docTitle: 'Cart',
      path: '/cart',
    });
  } catch (error) {
    console.error(error);
  }
};

exports.postCart = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    await req.user.addToCart(product);
  } catch (error) {
    console.error(error);
  }
};

exports.postRemoveCartItem = async (req, res) => {
  try {
    const { id } = req.body;
    await req.user.removeItemFromCart(id);
    res.redirect('/cart');
  } catch (error) {
    console.error(error);
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.session.user }).populate(
      'items.product'
    );
    res.render('shop/orders', {
      docTitle: 'Orders',
      path: '/orders',
      orders: orders,
    });
  } catch (error) {
    console.error(error);
  }
};

exports.postOrder = async (req, res) => {
  try {
    await Order.create({
      items: req.user.cart.items,
      user: req.user,
    });
    req.user.cart.items = [];
    await req.user.save();
    res.redirect('/orders');
  } catch (error) {
    console.error(error);
  }
};

exports.getCheckout = (req, res) => {
  res.render('shop/checkout', {
    docTitle: 'Checkout',
    path: '/checkout',
  });
};
