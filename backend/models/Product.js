const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    stockCount: {
      type: Number,
      required: [true, 'Stock count is required'],
      min: [0, 'Stock count cannot be negative'],
      default: 0,
    },
  },
  { timestamps: true }
);

// Text index to support name search
productSchema.index({ name: 'text' });

module.exports = mongoose.model('Product', productSchema);
