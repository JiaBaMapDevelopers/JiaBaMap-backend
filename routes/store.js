const express = require("express");
const router = express.Router();
const storeController = require("../controllers/storeController");

router.get("/", storeController.createStore); //新增餐廳

module.exports = router;
