const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/notificationController");

// 取得用戶通知
router.get(
  "/notification/:userId", 
  NotificationController.getNotifications
);

/* 
  #swagger.summary = 'Get notifications for a user'
  #swagger.description = 'Endpoint to get notifications for a specific user by userId'
  #swagger.parameters['userId'] = {
    in: 'path',
    description: 'The userId of the user whose notifications are being fetched',
    required: true,
    type: 'string',
  }
*/

// 新增通知
router.post(
  "/", 
);

/* 
  #swagger.summary = 'Create a new notification'
  #swagger.description = 'Endpoint to create a new notification'
  #swagger.parameters['body'] = {
    in: 'body',
    description: 'Details of the notification to be created',
    required: true,
    schema: {
      userId: 'string',
      storeId: 'string',
      commentId: 'string',
      userName: 'string',
      storeName: 'string',
      type: 'string',
      read: 'boolean',
    }
  }
*/

// 標記通知為已讀
router.patch(
  "/read/:notificationId", 
  NotificationController.markAsRead
);

/* 
  #swagger.summary = 'Mark a notification as read'
  #swagger.description = 'Endpoint to mark a specific notification as read by notificationId'
  #swagger.parameters['notificationId'] = {
    in: 'path',
    description: 'The ID of the notification to be marked as read',
    required: true,
    type: 'string',
  }
*/

module.exports = router;
