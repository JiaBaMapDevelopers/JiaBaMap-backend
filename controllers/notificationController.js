const mongoose = require("mongoose");
const Notification = require("../models/notificationModel");
const User = require("../models/usersModel");
const { getIO } = require("../socketConfig.js");


// 創建通知
exports.createNotification = async ({ receiverId, actionUserId, actionType, relatedId }) => {
  const sender = await User.findById(actionUserId);
  const notification = await Notification.create({
    notificationId: new mongoose.Types.ObjectId(),
    userId: receiverId,
    storeId: sender.storeId,
    commentId: relatedId,
    userImg: sender.userImg,
    userName: sender.userName,
    storeName: sender.storeName,
    actionType,
    read: false,
    timestamp: new Date(),
  });
  const io = getIO();
  io.to(receiverId).emit("newNotification", {
    notification,
    message: `${sender.userName} ${actionType === 'comment' ? 'commented on your post' : 'liked your post'} `,
  });

  return notification;
};

exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      notificationId, 
      { read: true }, 
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    const io = getIO();
    io.to(notification.userId).emit("readNotification", {
      notificationId,
      message: "Notification marked as read",
    });
    
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Error updating notification", error });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId })
    .sort({ timestamp: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error });
  }
};


module.exports = exports;