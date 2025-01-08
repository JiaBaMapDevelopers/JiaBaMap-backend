// models/notificationModel.js

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },           // 接收通知的用戶
  targetUserId: { type: String, required: true },     // 觸發通知的用戶
  actionType: {                                       // 動作類型
    type: String,
    required: true,
    enum: ['comment', 'like', 'reply']
  },
  relatedType: {                                      // 關聯類型
    type: String,
    required: true,
    enum: [
      'restaurant_comment',
      'restaurant_comment_like',
      'article_comment',
      'article_like',
      'article_comment_like',
      'article_comment_reply'
    ]
  },
  relatedId: { type: String },                        // 關聯的內容ID
  read: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
  expiresAt: { 
    type: Date, 
    default: () => new Date(+new Date() + 30*24*60*60*1000) 
  },
  metadata: {
    articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
    replyId: { type: mongoose.Schema.Types.ObjectId },
    originalContent: { type: String }
  }
}, {
  timestamps: true
});

notificationSchema.index({ userId: 1, read: 1, timestamp: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

notificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({ userId, read: false });
};

notificationSchema.statics.markMultipleAsRead = function(userId, notificationIds) {
  return this.updateMany(
    { _id: { $in: notificationIds }, userId },
    { read: true }
  );
};

module.exports = mongoose.model("Notification", notificationSchema);