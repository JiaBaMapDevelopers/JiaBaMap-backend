const express = require("express");
const router = express.Router();
const { googleLogin, verifyToken, storeLogin } = require("../controllers/authController");

// Google 登入路由
router.post("/user/login/google", async (req, res, next) => {
  try {
    await googleLogin(req, res, next);
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post("/user/logout", verifyToken, (_req, res) => {
  res.json({ message: "Logout successfully!" });
});

router.post("/store/login", storeLogin);

module.exports = router;
