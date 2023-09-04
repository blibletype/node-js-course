const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        product: {
          type: Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  resetToken: String,
  resetTokenExpirationDate: Date,
});

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex((cartProduct) => {
    return cartProduct.product.toString() === product._id.toString();
  });

  const updatedCartItems = [...this.cart.items];
  let newQuantity = 1;

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      product: product._id,
      quantity: newQuantity,
    });
  }
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.removeItemFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    return item.product.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
