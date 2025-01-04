const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
  commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  userImg: { type: String },
  userName: { type: String, required: true },
  storeName: { type: String },
  actionType: { 
    type: String, 
    required: true,
    enum: ['comment', 'like']  
  },
  read: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
}, {
  timestamps: true  // 添加 createdAt 和 updatedAt
});

module.exports = mongoose.model("Notification", notificationSchema);
