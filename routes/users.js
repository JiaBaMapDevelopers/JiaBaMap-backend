const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");

router.get("/:id", controller.getProfile);

router.put("/update/:id", controller.updateProfile);

module.exports = router;
