const Notification = require('../models/notificationModel');
const NotificationSetting = require('../models/notificationSettingModel');
const { getIO } = require('../socketConfig');
const jwt = require('jsonwebtoken');

class NotificationController {
  static async verifyAndExtractUserId(req) {
    try {
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) {
        throw new Error('未提供 Token，請重新登入');
      }

      const token = authorizationHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded.id;
    } catch (error) {
      console.error('Token 驗證失敗:', error);
      throw new Error('Token 驗證失敗，請重新登入');
    }
  }

  // 建立通知的通用方法
  static async createNotification(data) {
    try {
      console.log('Creating notification with data:', data);
      const { receiverId, actionUserId, actionType, relatedId, relatedType, additionalData = {} } = data;
      
      // 檢查通知設置
      const notificationSetting = await NotificationSetting.findOne({ userId: receiverId });
      if (notificationSetting) {
        const settingKey = {
          comment: 'comments',
          like: 'likes',
          reply: 'replies'
        }[actionType];
        
        if (settingKey && !notificationSetting.preferences[settingKey]) {
          console.log(`User ${receiverId} has disabled ${actionType} notifications`);
          return null;
        }
      }

      const notification = await Notification.create({
        userId: receiverId,
        targetUserId: actionUserId,
        actionType,
        relatedType,
        relatedId,
        metadata: {
          ...additionalData,
          originalContent: additionalData.content
        }
      });

      console.log('Notification created:', notification);

      // 發送 socket 通知
      const io = getIO();
      if (io) {
        io.to(receiverId.toString()).emit('newNotification', { 
          notification,
          message: this.getNotificationMessage(notification)
        });
        console.log('Socket notification sent to user:', receiverId);
      } else {
        console.warn('Socket.io instance not found');
      }

      return notification;
    } catch (error) {
      console.error('建立通知失敗:', error);
      return null;
    }
  }

  static getNotificationMessage(notification) {
    const actionMessages = {
      comment: '評論了你的貼文',
      like: '對你的貼文按讚',
      reply: '回覆了你的評論'
    };
    return actionMessages[notification.actionType] || '與你互動';
  }

  // 處理各種通知情境的統一方法
  static async handleNotification(type, data, req) {
    try {
      const userId = await this.verifyAndExtractUserId(req);

      const notificationTypes = {
        'comment': {
          actionType: 'comment',
          relatedType: 'restaurant_comment'
        },
        'like': {
          actionType: 'like',
          relatedType: 'restaurant_comment_like'
        },
        'article_comment': {
          actionType: 'comment',
          relatedType: 'article_comment'
        },
        'article_like': {
          actionType: 'like',
          relatedType: 'article_like'
        },
        'article_comment_like': {
          actionType: 'like',
          relatedType: 'article_comment_like'
        },
        'article_reply': {
          actionType: 'reply',
          relatedType: 'article_comment_reply'
        }
      };

      const notificationConfig = notificationTypes[type];
      if (!notificationConfig) {
        throw new Error('不支援的通知類型');
      }

      return await this.createNotification({
        ...notificationConfig,
        receiverId: data.receiverId,
        actionUserId: userId,
        relatedId: data.relatedId,
        additionalData: data.additionalData
      });
    } catch (error) {
      console.error('處理通知時發生錯誤:', error.message);
      return null;
    }
  }

  // API 端點方法
  static async getNotifications(req, res) {
    try {
      const userId = await this.verifyAndExtractUserId(req);
      const { page = 1, limit = 20 } = req.query;
      
      const notifications = await Notification.find({ userId })
        .sort({ timestamp: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
      
      res.status(200).json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ message: "Error fetching notifications", error: error.message });
    }
  }

  static async markAsRead(req, res) {
    try {
      const { notificationId } = req.params;
      const userId = await this.verifyAndExtractUserId(req);
      
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { read: true },
        { new: true }
      );
      
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      
      const io = getIO();
      if (io) {
        io.to(userId.toString()).emit("readNotification", { notificationId });
      }
      
      res.status(200).json(notification);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({ message: "Error marking notification as read", error: error.message });
    }
  }

  static getNotificationMessage(notification) {
    const actionMessages = {
      comment: '評論了你的貼文',
      like: '對你的貼文按讚',
      reply: '回覆了你的評論'
    };
    return actionMessages[notification.actionType] || '與你互動';
  }
}


module.exports = NotificationController;