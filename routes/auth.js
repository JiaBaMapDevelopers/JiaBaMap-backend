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

// Google OAuth 路由
router.get("/google", (req, res) => {
  // 重定向到 Google 登入頁面
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?
    client_id=${process.env.GOOGLE_CLIENT_ID}&
    redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&
    response_type=code&
    scope=email profile&
    access_type=offline`;
  
  res.redirect(googleAuthUrl);
});

// Google OAuth 回調路由
router.get("/google/callback", async (req, res) => {
  try {
    const result = await googleLogin(req, res);
    
    // 回傳包含登入結果的 HTML，使用 postMessage 傳送數據給opener
    const script = `
      <script>
        window.opener.postMessage(
          {
            success: true,
            user: ${JSON.stringify(result.user)},
            token: "${result.token}"
          }, 
          '${process.env.FRONTEND_URL}'
        );
        window.close();
      </script>
    `;
    
    res.send(script);
  } catch (error) {
    console.error('Google login error:', error);
    const script = `
      <script>
        window.opener.postMessage(
          {
            success: false,
            error: "Login failed"
          }, 
          '${process.env.FRONTEND_URL}'
        );
        window.close();
      </script>
    `;
    res.send(script);
  }
});

router.post("/user/logout", verifyToken, (_req, res) => {
  res.json({ message: "Logout successfully!" });
});

router.post("/store/login", storeLogin);

module.exports = router;
