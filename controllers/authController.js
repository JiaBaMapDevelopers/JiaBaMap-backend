const User = require("../models/usersModel");
const Store = require("../models/storeModel");
const jwt = require("jsonwebtoken");
const { parseGoogleIdToken, generateToken } = require("../utils");
const bcrypt = require("bcryptjs");

const verifyToken = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://jiaba-map.netlify.app');
  res.header('Access-Control-Allow-Credentials', 'true');
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    res.status(401).json({ msg: "Token is invalid. Please login again." });
    return;
  }

  try {
    const token = authorizationHeader.split(" ")[1];
    console.log(`Token: ${token}`);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.body.id = decoded.id;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ msg: "Token is invalid. Please login again." });
  }
};

const googleLogin = async (req, res, _next) => {
  res.header('Cross-Origin-Opener-Policy', 'unsafe-none');
  res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
  res.header('Access-Control-Allow-Origin', 'https://jiaba-map.netlify.app');
  res.header('Access-Control-Allow-Credentials', 'true');
  const token = req.body.credential;
  let payload;
  try {
    payload = await parseGoogleIdToken(token);
  } catch (err) {
    console.log(`Failed to get the payload from the token: ${err}`);
    res.status(401).send();
    return;
  }
  try {
    const googleId = payload["sub"];
    const email = payload["email"];
    const name = payload["name"];
    const profilePicture = payload["picture"];

    let user = await User.findOne({ googleId });
    if (!user) {
      user = new User({
        googleId,
        name,
        email,
        profilePicture,
      });
      await user.save();
    }

    const accessToken = generateToken({
      id: user._id,
    });

    return res.json({
      token: accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Error during Google login:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const storeLogin = async (req, res, _next) => {
  const { username, password } = req.body;

  try {
    const store = await Store.findOne({ username });
    if (!store) {
      return res.status(404).json({ message: "帳號不存在" });
    }

    const isPasswordValid = await bcrypt.compare(password, store.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "密碼錯誤" });
    }

    const accessToken = generateToken({
      id: store._id,
    });

    return res.status(200).json({
      token: accessToken,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "伺服器錯誤，請稍後再試" });
  }
};

module.exports = {
  googleLogin,
  verifyToken,
  storeLogin,
};
