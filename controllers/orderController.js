const Order = require("../models/orderModel");
const OrderDetail = require("../models/orderDetailModel");
const Menu = require("../models/menuModel");

//計算總金額
const calculateTotalAmount = async (items) => {
  let totalAmount = 0;
  for (let item of items) {
    const product = await Menu.findById(item.productId);
    if (product) {
      totalAmount += product.price * item.quantity;
    } else {
      console.error(`Product with ID ${item.productId} not found`);
    }
  }
  return totalAmount;
};

//新增訂單
const createOrder = async (req, res) => {
  const { customerId, storeId, pickupTime, items, storeName } = req.body;
  
  const totalAmount = await calculateTotalAmount(items);
  
  const order = new Order({
    customerId,
    storeId,
    pickupTime,
    totalAmount,
    storeName,
  });
  
  await order.save();
  
  try {
    const orderDetails = items.map((item) => ({
      orderId: order._id,
      productId: item.productId,
      quantity: item.quantity,
      note: item.note,
      spec: item.spec,
    }));

    const savedOrder = await OrderDetail.insertMany(orderDetails);
    res.status(201).json({ message: "成功建立訂單", savedOrder });
  } catch (error) {
    res.status(500).json({ message: "建立訂單發生錯誤，請稍後再試" });
  }
};

//依照使用者id/店家id 取得所有未刪除訂單
const getOrders = async (req, res) => {
  const { customerId } = req.params;
  const filter = { 
    isDeleted: false,
    customerId: customerId,
   };

 
 

  const orders = await Order.find(filter).populate("storeName").lean();
  try {

    if (!orders || orders.length === 0) {
      return res.status(201).json({ message: "沒有找到訂單" });
    }

    const response = orders.map((order) => ({
      orderId: order._id,
      restaurantName: order.storeName,
      customerId: order.customerId,
      totalAmount: order.totalAmount,
      orderTime: order.orderTime,
      isPaid: order.isPaid,
    }));
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "取得訂單發生錯誤，請稍後再試" });
  }
};

//依照訂單id取得詳細訂單
const getOrderDetails = async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId)
    .populate("storeId", "name ")
    .lean();

  if (!order) {
    return res.status(404).json({ message: "訂單不存在" });
  }
  try {
    const orderDetails = await OrderDetail.find({ orderId })
      .populate("productId", "name price storeId")
      .lean();

    const response = {
      orderId: order._id,
      restaurantName: order.storeId.name,
      customerId: order.customerId,
      totalAmount: order.totalAmount,
      pickupTime: order.pickupTime,
      orderTime: order.orderTime,
      isPaid: order.isPaid,
      items: orderDetails.map((detail) => ({
        productId: detail.productId._id,
        productName: detail.productId.name,
        quantity: detail.quantity,
        note: detail.note,
        spec: detail.spec,
        price: detail.productId.price,
      })),
    };
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "取得詳細訂單發生錯誤，請稍後再試" });
  }
};

//更新訂單
const updateOrder = async (req, res) => {
  const { orderId } = req.params;
  const { pickupTime, items } = req.body;
  let updatedFields = {};
  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "訂單不存在" });
  }
  if (pickupTime) {
    updatedFields.pickupTime = pickupTime;
  }
  if (items && items.length > 0) {
    let totalAmount = await calculateTotalAmount(items);
    updatedFields.totalAmount = totalAmount;

    for (let item of items) {
      console.log(
        `Updating OrderDetail for Order ID: ${order._id}, Product ID: ${item.productId}`,
      );
      await OrderDetail.findOneAndUpdate(
        { orderId: order._id, productId: item.productId },
        { $set: { quantity: item.quantity, note: item.note, spec: item.spec } },
        { new: true },
      );
    }
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(orderId, updatedFields, {
      new: true,
      upsert: false,
    });

    res.status(200).json({ message: "更新訂單成功", updatedOrder });
  } catch (error) {
    res.status(500).json({ message: "更新訂單發生錯誤，請稍後再試" });
  }
};

//刪除訂單
const deleteOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { isDeleted: true },
      { new: true },
    );

    if (!order) {
      return res.status(404).json({ message: "訂單不存在" });
    }
    res.status(200).json({ message: "刪除訂單成功", order });
  } catch (error) {
    res.status(500).json({ message: "刪除訂單發生錯誤，請稍後再試" });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderDetails,
  updateOrder,
  deleteOrder,
};
