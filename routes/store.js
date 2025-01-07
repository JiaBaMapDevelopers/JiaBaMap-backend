const express = require("express");
const router = express.Router();
const storeController = require("../controllers/storeController");

router.post("/", storeController.createStore); //新增餐廳

router.get("/get", storeController.getStore);

router.get("/get/:placeId", storeController.getStoreByPlace)
module.exports = router;
