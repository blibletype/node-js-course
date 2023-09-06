const Product = require('../models/product');
const { validationResult } = require('express-validator');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    docTitle: 'Add Product',
    path: '/admin/add-product',
    editing: 'false',
    isAuth: req.session.user,
  });
};

exports.postAddProduct = async (req, res, next) => {
  try {
    const { title, price, description, imageUrl } = req.body;
    const errors = validationResult(req).array() || [];
    if (errors.length > 0) {
      return res.status(422).render('admin/edit-product', {
        docTitle: 'Add Product',
        path: '/admin/add-product',
        errors: errors,
        editing: 'false',
        oldInputs: {
          title: title,
          price: price,
          description: description,
          imageUrl: imageUrl,
        },
      });
    }
    await Product.create({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
      userId: req.session.user,
    });
    res.redirect('/products');
  } catch (error) {
    return next(error);
  }
};

exports.getEditProduct = async (req, res, next) => {
  try {
    const editMode = req.query.edit;
    if (!editMode) return res.redirect('/');
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.redirect('/');
    res.render('admin/edit-product', {
      docTitle: 'Edit product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product,
      isAuth: req.session.user,
    });
  } catch (error) {
    return next(error);
  }
};

exports.postEditProduct = async (req, res, next) => {
  try {
    const { id, title, price, description, imageUrl } = req.body;
    const product = await Product.findById(id);
    if (product.userId.toString() !== req.session.user._id.toString()) {
      req.flash('error', "You don't have enough permissions");
      return res.redirect('/admin/products');
    }
    const errors = validationResult(req).array() || [];
    if (errors.length > 0) {
      return res.status(422).render('admin/edit-product', {
        docTitle: 'Edit Product',
        path: '/admin/edit-product',
        errors: errors,
        editing: 'true',
        product: product,
      });
    }
    product.title = title;
    product.price = price;
    product.imageUrl = imageUrl;
    product.description = description;
    await product.save();
    res.redirect('/admin/products');
  } catch (error) {
    return next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    if (product.userId.toString() !== req.session.user._id.toString()) {
      req.flash('error', "You don't have enough permissions");
      return res.redirect('admin/products');
    }
    await product.deleteOne();
    res.redirect('/admin/products');
  } catch (error) {
    return next(error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ userId: req.session.user._id });
    res.render('admin/products', {
      products: products,
      docTitle: 'Products',
      path: '/admin/products',
      isAuth: req.session.user,
    });
  } catch (error) {
    return next(error);
  }
};
