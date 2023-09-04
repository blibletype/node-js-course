const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    docTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuth: req.session.user,
  });
};

exports.postAddProduct = async (req, res) => {
  try {
    const { title, price, description, imageUrl } = req.body;
    await Product.create({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
      userId: req.session.user,
    });
    res.redirect('/products');
  } catch (error) {
    console.error(error);
  }
};

exports.getEditProduct = async (req, res) => {
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
    console.error(error);
  }
};

exports.postEditProduct = async (req, res) => {
  try {
    const { id, title, price, description, imageUrl } = req.body;
    const product = await Product.findById(id);
    if (product.userId.toString() !== req.session.user._id.toString()) {
      req.flash('error', "You don't have enough permissions");
      return res.redirect('/admin/products');
    }
    product.title = title;
    product.price = price;
    product.imageUrl = imageUrl;
    product.description = description;
    await product.save();
    res.redirect('/admin/products');
  } catch (error) {
    console.error(error);
  }
};

exports.deleteProduct = async (req, res) => {
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
    console.error(error);
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ userId: req.session.user._id });
    res.render('admin/products', {
      products: products,
      docTitle: 'Products',
      path: '/admin/products',
      isAuth: req.session.user,
    });
  } catch (error) {
    console.error(error);
  }
};
