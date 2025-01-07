const mongoose = require("mongoose");

const orderDetailSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  productId: {
    type: Number,
    ref: "Menu",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  note: String,
  spec: String,
});

module.exports = mongoose.model("OrderDetail", orderDetailSchema);
