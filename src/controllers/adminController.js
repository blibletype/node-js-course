const Product = require('../models/product');
const { validationResult } = require('express-validator');
const { deleteFile } = require('../utils/file');

const ITEMS_LIMIT = 4;

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
    const { title, price, description } = req.body;
    const image = req.file;
    const errors = validationResult(req).array() || [];
    if (!image) errors.push({ path: 'imageUrl' });
    if (errors.length > 0 || !image) {
      return res.status(422).render('admin/edit-product', {
        docTitle: 'Add Product',
        path: '/admin/add-product',
        errors: errors,
        editing: 'false',
        oldInputs: {
          title: title,
          price: price,
          description: description,
        },
      });
    }
    await Product.create({
      title: title,
      price: price,
      imageUrl: image.path,
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
    const { id, title, price, description } = req.body;
    const image = req.file;
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
    if (image) {
      deleteFile(product.imageUrl);
      product.imageUrl = image.path;
    }
    product.description = description;
    await product.save();
    res.redirect('/admin/products');
  } catch (error) {
    return next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (product.userId.toString() !== req.session.user._id.toString()) {
      req.flash('error', "You don't have enough permissions");
      return res.redirect('admin/products');
    }
    deleteFile(product.imageUrl);
    await product.deleteOne();
    res.status(200).json({
      message: 'Success!',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Deleting product failed...',
    });
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const page = +req.query.page || 1;
    const totalItemsCount = await Product.find().countDocuments();
    const products = await Product.find({ userId: req.session.user._id })
      .skip((page - 1) * ITEMS_LIMIT)
      .limit(ITEMS_LIMIT);
    res.render('admin/products', {
      products: products,
      docTitle: 'Products',
      path: '/admin/products',
      isAuth: req.session.user,
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
