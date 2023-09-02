const mongoose = require('mongoose');
const { Types, Schema } = mongoose;

const orderSchema = new Schema({
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
  user: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Order', orderSchema);
