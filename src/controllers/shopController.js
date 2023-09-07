const Product = require('../models/product');
const Order = require('../models/order');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { buildInvoice } = require('../utils/helpers');
const { deleteFile } = require('../utils/file');

exports.getIndex = (req, res, next) => {
  res.render('shop/index', {
    docTitle: 'Home',
    path: '/',
    successMessage: req.flash('success'),
  });
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.render('shop/products', {
      products: products,
      docTitle: 'Shop',
      path: '/products',
    });
  } catch (error) {
    return next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('shop/product-detail', {
      docTitle: product.title,
      product: product,
      path: '/products',
    });
  } catch (error) {
    return next(error);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const user = await req.user.populate('cart.items.product');
    res.render('shop/cart', {
      items: user.cart.items,
      docTitle: 'Cart',
      path: '/cart',
    });
  } catch (error) {
    return next(error);
  }
};

exports.postCart = async (req, res, next) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    await req.user.addToCart(product);
    res.redirect('/cart');
  } catch (error) {
    return next(error);
  }
};

exports.postRemoveCartItem = async (req, res, next) => {
  try {
    const { id } = req.body;
    await req.user.removeItemFromCart(id);
    res.redirect('/cart');
  } catch (error) {
    return next(error);
  }
};

exports.getOrders = async (req, res, next) => {
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
    return next(error);
  }
};

exports.postOrder = async (req, res, next) => {
  try {
    await Order.create({
      items: req.user.cart.items,
      user: req.user,
    });
    req.user.cart.items = [];
    await req.user.save();
    res.redirect('/orders');
  } catch (error) {
    return next(error);
  }
};

exports.getInvoice = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({
      _id: orderId,
      user: req.session.user._id,
    })
      .populate('items.product')
      .populate('user', 'email')
      .catch(() => {
        return res.status(404).render('404', { docTitle: 'Page Not Found' });
      });
    if (!order) {
      return res.status(404).render('404', { docTitle: 'Page Not Found' });
    }

    const invoiceName = `invoice-${orderId}.pdf`;
    const invoicePath = path.join('src', 'data', 'invoices', invoiceName);

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'inline; filename="' + invoiceName + '"'
    );
    doc.pipe(fs.createWriteStream(invoicePath));
    doc.pipe(res);
    buildInvoice(doc, order);
    doc.end();
  } catch (error) {
    return next(error);
  }
};

exports.getCheckout = (req, res) => {
  res.render('shop/checkout', {
    docTitle: 'Checkout',
    path: '/checkout',
  });
};
