const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");

require("dotenv").config();



const restaurantsRouter = require("./routes/restaurants");
const commentsRouter = require("./routes/comments");
const articlelistRouter = require("./routes/articlelist");
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const menuRouter = require("./routes/menu");
const storeRouter = require("./routes/store");
const orderRouter = require("./routes/order");
const linepayRouter = require("./routes/linepay");
const cartRouter = require("./routes/cart");

require("dotenv").config();
// console.log('GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS);
console.log("MONGO_URI:", process.env.MONGO_URI); // 測試環境變數是否正確載入

// Initialize MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Local MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.once("open", () => {
  console.log("MongoDB connected successfully");
});

const app = express();
const server = http.createServer(app);

// 定義允許的來源
const allowedOrigins = [
  'https://jiabamap.up.railway.app',    // Railway 部署的前端
  'http://localhost:3000',              // 本地開發環境
  'https://accounts.google.com'
];

// 統一的 CORS 設定
const corsOptions = {
  origin: function(origin, callback) {
    // 允許沒有 origin 的請求（如移動應用）
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Cross-Origin-Opener-Policy',
    'Cross-Origin-Embedder-Policy',
    'Cross-Origin-Resource-Policy'
  ],
  exposedHeaders: ['Set-Cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 200
};

// 應用 CORS 設定 - 確保這是第一個中間件
app.use(cors(corsOptions));

// 基本中間件
const { initializeSocket } = require("./socketConfig");
initializeSocket(server);

const port = process.env.port || 3000;
server
  .listen(port, () => {
    console.log(`Server is running on port ${port}`);
  })
  .on("error", (err) => {
    console.error("Error starting server:", err);
  });

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true,
  }),
);



// app.use(cors({
//   origin: process.env.FRONTEND_URL,
//   credentials: true
// }));
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// 路由
app.use("/restaurants", restaurantsRouter);
app.use("/comments", commentsRouter);
app.use("/articles", articlelistRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);
// app.use("/notification", notificationRouter);
app.use("/menu", menuRouter); 
app.use('/uploads', express.static('uploads'));
app.use("/store", storeRouter);
app.use("/order", orderRouter);
app.use("/payments/linepay", linepayRouter);
app.use("/cart", cartRouter);

// 全局錯誤處理中間件
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    path: req.path,
    method: req.method
  });
});

// 404 處理
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    method: req.method
  });
});




module.exports = app;
