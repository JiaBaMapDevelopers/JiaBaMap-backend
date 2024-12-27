const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { googleLogin, verifyToken } = require("../controllers/authController");

router.post("/user/login/google", googleLogin);

router.post(
  "/user/logout",
  verifyToken,
  (req, res) => {
    res.json({ message: "Logout successfully!" });
  },
  //FIXME 確認是否由前端清除localstorage中的jwt
);

module.exports = router;
