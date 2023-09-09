const Product = require('../models/product');
const Order = require('../models/order');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { buildInvoice } = require('../utils/helpers');
const stripe = require('stripe')(process.env.STRIPE_KEY);

const ITEMS_LIMIT = 4;

exports.getIndex = (req, res, next) => {
  res.render('shop/index', {
    docTitle: 'Home',
    path: '/',
    successMessage: req.flash('success'),
  });
};

exports.getProducts = async (req, res, next) => {
  try {
    const page = +req.query.page || 1;
    const totalItemsCount = await Product.find().countDocuments();
    const products = await Product.find()
      .skip((page - 1) * ITEMS_LIMIT)
      .limit(ITEMS_LIMIT);
    res.render('shop/products', {
      products: products,
      docTitle: 'Shop',
      path: '/products',
      currentPage: page,
      hasNextPage: ITEMS_LIMIT * page < totalItemsCount,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItemsCount / ITEMS_LIMIT),
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

exports.getCheckout = async (req, res, next) => {
  try {
    const user = await req.user.populate('cart.items.product');
    const products = user.cart.items;
    let total = 0;
    products.forEach((item) => {
      total += item.quantity * item.product.price;
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: products.map((item) => {
        return {
          price_data: {
            currency: 'usd',
            unit_amount: item.product.price * 100,
            product_data: {
              name: item.product.title,
              description: item.product.description,
            },
          },
          quantity: item.quantity,
        };
      }),
      mode: 'payment',
      success_url: req.protocol + '://' + req.get('host') + '/checkout/success',
      cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel',
    });
    res.render('shop/checkout', {
      items: user.cart.items,
      docTitle: 'Checkout',
      path: '/checkout',
      totalSum: total,
      sessionId: session.id,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getCheckoutSuccess = async (req, res, next) => {
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
