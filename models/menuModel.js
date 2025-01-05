const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
  itemId: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
    required: [true, "名稱為必填項目"],
    maxlength: 100,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    maxlength: 50,
    required: [true, "分類為必填項目"],
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
  },
  placeId: {
    type: String,
    unique: true,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  imageUrl: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("Menu", menuSchema);
