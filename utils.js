const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const googleClientId = process.env.GOOGLE_CLIENT_ID;

function generateToken(payload) {
  console.log(payload);
  return jwt.sign(payload, process.env.JWT_SECRET, {
    issuer: "jiabamap",
    // FIXME
    // expiresIn: "1 day",
  });
}

async function parseGoogleIdToken(token) {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: googleClientId,
  });
  const payload = ticket.getPayload();
  return payload;
}

module.exports = {
  generateToken,
  parseGoogleIdToken,
};
