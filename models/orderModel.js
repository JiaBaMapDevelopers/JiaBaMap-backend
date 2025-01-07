const mongoose = require("mongoose");
const Store = require("./storeModel");

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  storeId: {
    type: String,
    ref: "Store",
    required: true,
  },
  storeName: {
    type: String,
    required: true,
  },
  orderTime: {
    type: Date,
    default: Date.now,
  },
  pickupTime: {
    type: Date,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Order", orderSchema);
