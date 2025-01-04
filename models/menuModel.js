const mongoose = require("mongoose");
const Store = require("../models/storeModel");

const menuSchema = new mongoose.Schema({
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store", // 關聯到餐廳
    required: true,
  },
  singleDishId: {
    type: String, //單一餐點id
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String, //餐點描述
    trim: true,
  },
  category: {
    type: String, // 如「主餐」、「飲料」等
    trim: true,
  },
  placeId: {
    //Google Place ID
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  isAvailable: {
    type: Boolean, //是否可售
    default: true,
  },
});

module.exports = mongoose.model("Menu", menuSchema);
