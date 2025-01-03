const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const restaurantsRouter = require("./routes/restaurants");
const commentsRouter = require("./routes/comments");
const articlelistRouter = require('./routes/articlelist');
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");

require("dotenv").config();

// Initialize MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Local MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

const app = express();

// CORS 設置
app.use(cors());

// {
//   origin: process.env.FRONTEND_URL,
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }


app.get('/test', (_req, res) => {
  res.json({ message: 'API is working!' });
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/restaurants", restaurantsRouter);
app.use("/comments", commentsRouter);
app.use('/articles', articlelistRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);

// 添加 404 處理
app.use((req, res, _next) => {
  console.log(`404 Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ 
    error: 'Not Found',
    path: req.url
  });
});

// 錯誤處理中間件
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

module.exports = app;
