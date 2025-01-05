const mongoose = require("mongoose");
const Order = require("../models/orderModel");
const Store = require("../models/storeModel");

mongoose.connect("mongodb://localhost:27017/tests");

const seedOrders = async () => {
  // 取得餐廳資料
  const stores = await Store.find();
  console.log(stores[0]._id);

  const orders = [
    {
      customerId: new mongoose.Types.ObjectId(), // 假的客戶 ID
      storeId: stores[0]._id, // 第一家餐廳的 ID
      pickupTime: new Date(Date.now() + 3600000), // 一小時後
      totalAmount: 200,
      isPaid: true,
    },
    {
      customerId: new mongoose.Types.ObjectId(), // 假的客戶 ID
      storeId: stores[1]._id, // 第二家餐廳的 ID
      pickupTime: new Date(Date.now() + 7200000), // 兩小時後
      totalAmount: 150,
      isPaid: false,
    },
  ];

  await Order.insertMany(orders);
  console.log("訂單種子資料插入成功");
  mongoose.connection.close();
};

seedOrders();
