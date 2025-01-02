const User = require("../models/usersModel");
const jwt = require("jsonwebtoken");
const { parseGoogleIdToken, generateToken } = require("../utils");

const verifyToken = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    res.status(401).json({ msg: "Token is invalid. Please login again." });
    return;
  }

  const token = authorizationHeader.split(" ")[1];
  console.log(`Token: ${token}`);
  const isValid = jwt.verify(token, process.env.JWT_SECRET);
  if (!isValid) {
    res.status(401).json({ msg: `Token is invalid. Please login again.` });
    return;
  }

  const payload = jwt.decode(token);
  const id = payload.id;
  //   const username = payload.name;

  req.body.id = id;
  //   req.body.name = username;

  next();
};

const googleLogin = async (req, res, next) => {
  const token = req.body.credential;
  let payload;
  try {
    payload = await parseGoogleIdToken(token);
  } catch (err) {
    console.log(`Failed to get the payload from the token: ${error}`);
    res.status(401).send();
    return;
  }
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

  res.json({
    token: accessToken,
  });
};

module.exports = {
  googleLogin,
  verifyToken,
};
