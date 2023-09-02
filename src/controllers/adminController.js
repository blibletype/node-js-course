const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    docTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = async (req, res) => {
  const { title, price, description, imageUrl } = req.body;
  Product.create({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
    userId: req.user,
  })
    .then(() => {
      res.redirect('/products');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  if (!editMode) return res.redirect('/');
  const { id } = req.params;
  Product.findById(id)
    .then((product) => {
      if (!product) return res.redirect('/');
      res.render('admin/edit-product', {
        docTitle: 'Edit product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res) => {
  const { id, title, price, description, imageUrl } = req.body;
  Product.updateOne(
    { _id: id },
    {
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
    }
  )
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.body;
  Product.findByIdAndDelete(id)
    .then(() => {
      res.redirect('/products');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res) => {
  Product.find()
    .then((products) => {
      res.render('admin/products', {
        products: products,
        docTitle: 'Products',
        path: '/admin/products',
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
