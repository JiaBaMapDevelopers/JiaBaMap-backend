const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const { Storage } = require("@google-cloud/storage");
const googleClientId = process.env.GOOGLE_CLIENT_ID;

function generateToken(payload) {
  console.log(payload);
  return jwt.sign(payload, process.env.JWT_SECRET, {
    issuer: "jiabamap",
    // FIXME
    // expiresIn: "1 day",
  });
}



const fs = require('fs');
const path = require('path');

// 確定檔案儲存位置（通常是 /tmp 資料夾）
const keyFilePath = path.join('/tmp', 'service-account-key.json');

// 從環境變數中讀取 JSON 並寫入檔案
fs.writeFileSync(keyFilePath, process.env.GOOGLE_APPLICATION_CREDENTIALS);

// 設定 GOOGLE_APPLICATION_CREDENTIALS 為生成的檔案路徑
process.env.GOOGLE_APPLICATION_CREDENTIALS = keyFilePath;

console.log(`GOOGLE_APPLICATION_CREDENTIALS set to: ${keyFilePath}`);


async function parseGoogleIdToken(token) {
  try {
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    if (!ticket) {
      throw new Error('Invalid ticket');
    }
    
    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('Invalid payload');
    }
    
    return payload;
  } catch (error) {
    console.error('Google token verification error:', {
      error: error.message,
      token: token ? token.substring(0, 10) + '...' : 'no token',
      clientId: process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.substring(0, 10) + '...' : 'no client id'
    });
    throw error;
  }
}

async function uploadPhotos(files) {
  //TODO upload photos to GCS
  const storage = new Storage({
    projectId: process.env.GOOGLE_PROJECT_ID,
    credentials: {
      type: "service_account",
      project_id: "inner-tokenizer-441507-d8",
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),  // 注意這裡需要處理換行符
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL
    }
  });
  const photoUrls = [];
  for (const file of files) {
    const bucketName = process.env.BUCKET_NAME;
    const fileName = encodeURIComponent(file.originalname);
    const objectName = `restaurant/comment/${fileName}`;
    await storage.bucket(bucketName).file(objectName).save(file.buffer);
    const url = `${process.env.GOOGLE_CLOUD_STORAGE_BASE_URL}${bucketName}/${objectName}`;
    photoUrls.push(url);
  }
  return photoUrls;
}







module.exports = {
  generateToken,
  parseGoogleIdToken,
  uploadPhotos,
};
