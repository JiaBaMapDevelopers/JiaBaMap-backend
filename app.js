const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");
const mongoose = require("mongoose");
const http = require("http");

require("dotenv").config();


const notificationRouter = require("./routes/notification");
const restaurantsRouter = require("./routes/restaurants");
const commentsRouter = require("./routes/comments");
const articlelistRouter = require('./routes/articlelist');
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");


// Initialize MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.once('open', () => {
  console.log('MongoDB connected successfully');
});

const app = express();
const server = http.createServer(app);

const { initializeSocket } = require("./socketConfig");
initializeSocket(server);

const port =5001;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}).on('error', (err) => {
  console.error('Error starting server:', err);
});

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true
}));


// app.use(cors({
//   origin: process.env.FRONTEND_URL,
//   credentials: true
// }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// app.use(cors())

app.use("/restaurants", restaurantsRouter);
app.use("/comments", commentsRouter);
app.use('/articles', articlelistRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/notification", notificationRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/test", (req, res) => {
  res.json({ message: "Hello World!" });
})

module.exports = app;
