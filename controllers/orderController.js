const Order = require("../models/orderModel");
const OrderDetail = require("../models/orderDetailModel");

//新增訂單
const createOrder = async (req, res) => {
  try {
    const { customerId, storeId, pickupTime, totalAmount, items } = req.body;
    const order = new Order({
      customerId,
      storeId,
      pickupTime,
      totalAmount,
    });

    const savedOrder = await order.save();
    console.log("Order saved successfully:", savedOrder);

    const orderDetails = items.map((item) => ({
      orderId: order._id,
      productId: item.productId,
      quantity: item.quantity,
      note: item.note,
      spec: item.spec,
    }));

    await OrderDetail.insertMany(orderDetails);
    res.status(201).json({ message: "成功建立訂單", order });
  } catch (error) {
    res.status(500).json({ message: "建立訂單發生錯誤，請稍後再試" });
  }
};

//依照使用者id取得所有訂單
const getOrdersByCustomer = async (req, res) => {
  try {
    const { customerId } = req.body;
    const orders = await Order.find({ customerId, isDeleted: false })
      .populate("storeId", "name")
      .lean();

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "沒有找到訂單" });
    }
    // 檢查每個訂單中的 storeId 是否為 null
    orders.forEach((order) => {
      console.log(order);
    });

    const response = orders.map((order) => ({
      orderId: order._id,
      restaurantName: order.storeId.name,
      totalAmount: order.totalAmount,
      orderTime: order.orderTime,
      isPaid: order.isPaid,
    }));
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "取得訂單失敗" });
  }
};

//依照店家id、訂單id取得詳細訂單
const getOrderDetails = async (req, res) => {
  try {
    const { storeId, orderId } = req.params;
    const { customerId } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      customerId,
      storeId,
    })
      .populate("storeId", "name ")
      .lean();

    if (!order) {
      return res.status(404).json({ message: "訂單不存在" });
    }

    const orderDetails = await OrderDetail.find({ orderId })
      .populate("productId", "name price")
      .lean();

    const response = {
      orderId: order._id,
      restaurantName: order.storeId.name,
      totalAmount: order.totalAmount,
      orderTime: order.orderTime,
      isPaid: order.isPaid,
      items: orderDetails.map((detail) => ({
        productName: detail.productId.name,
        quantity: detail.quantity,
        note: detail.note,
        spec: detail.spec,
        price: detail.productId.price,
      })),
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "取得詳細訂單錯誤" });
  }
};

//更新訂單

//刪除訂單

module.exports = {
  createOrder,
  getOrdersByCustomer,
  getOrderDetails,
};
