const Notification = require('../models/notificationModel');
const NotificationService = require('../services/notificationService');
const { getIO } = require('../socketConfig');

const createNotification = async ({
  userId,
  targetUserId,
  relatedType,
  actionType,
  metadata = {}
}) => {
  try {
    const notification = await Notification.create({
      userId,
      targetUserId,
      relatedType,
      actionType,
      metadata,
      createdAt: new Date()
    });

    // 發送 WebSocket 通知
    const io = getIO();
    io.to(targetUserId.toString()).emit('newNotification', { notification });

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

class NotificationController {
  // 獲取用戶通知
  static async getNotifications(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 20 } = req.query;
      const notifications = await NotificationService.getUserNotifications(userId, page, limit);
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Error fetching notifications", error });
    }
  }

  // 獲取未讀通知數量
  static async getUnreadCount(req, res) {
    try {
      const { userId } = req.params;
      const count = await Notification.getUnreadCount(userId);
      res.status(200).json({ count });
    } catch (error) {
      res.status(500).json({ message: "Error fetching unread count", error });
    }
  }

  // 標記通知為已讀
  static async markAsRead(req, res) {
    try {
      const { notificationId } = req.params;
      const { userId } = req.user;
      
      const notification = await NotificationService.markAsRead(userId, notificationId);
      
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      
      res.status(200).json(notification);
    } catch (error) {
      res.status(500).json({ message: "Error marking notification as read", error });
    }
  }

  // 批量標記已讀
  static async markMultipleAsRead(req, res) {
    try {
      const { notificationIds } = req.body;
      const { userId } = req.params;
      
      await Notification.markMultipleAsRead(userId, notificationIds);
      
      res.status(200).json({ message: "Notifications marked as read" });
    } catch (error) {
      res.status(500).json({ message: "Error marking notifications as read", error });
    }
  }
}

module.exports = { NotificationController, createNotification };