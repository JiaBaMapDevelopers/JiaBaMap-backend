const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");

router.get("/:id", controller.getProfile);

router.put("/update/:id", controller.updateProfile);

router.post("/favorites/:id", controller.addFavorites)

router.delete("/favorites/delete/:id", controller.delFavorites)

module.exports = router;
