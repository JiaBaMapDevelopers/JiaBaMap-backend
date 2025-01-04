const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/orderController.js");

router.post("/", OrderController.createOrder); //新增訂單
router.get("/", OrderController.getOrdersByCustomer); //取得使用者所有訂單

module.exports = router;
