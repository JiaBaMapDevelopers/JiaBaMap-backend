const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    },
    path: '/socket.io'  // 確保路徑正確
  });

  // 中介層：驗證 token
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication token not provided'));
      }

      // 驗證 token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // 加入用戶專屬房間
    socket.on('join', (userId) => {
      if (userId) {
        socket.join(userId.toString());
        console.log(`User ${userId} joined their room`);
      }
    });

    // 監聽斷開連接事件
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    // 錯誤處理
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = {
  initializeSocket,
  getIO
};