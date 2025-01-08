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
  items: [
    {
        productId: { type: String, required: true },
        productName: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }
    }
],
  orderTime: {
    type: Date,
    default: Date.now,
  },
  
  pickupTime: {
    type: Date,
    required: true,
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
