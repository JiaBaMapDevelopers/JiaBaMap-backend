const express = require("express");
const router = express.Router();
const controller = require("../controllers/notificationController");

// 取得用戶通知
router.get(
  "/:userId", 
  controller.getNotifications
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
  controller.markAsRead
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

const testNotification = [
  {
    "notificationId": "64f18e1b6e08a2001a1d9e01",
    "userId": "user123",
    "storeId": "store001",
    "commentId": "comment001",
    "userImg": "https://i.pinimg.com/1200x/c0/8d/d4/c08dd43375752cd0437c736e6eabb389.jpg",
    "userName": "測試用戶A",
    "storeName": "示範店鋪A",
    "type": "comment",
    "read": false,
    "timestamp": "2025-01-04T10:00:00Z"
  },
  {
    "notificationId": "64f18e1b6e08a2001a1d9e02",
    "userId": "user3",
    "storeId": "store002",
    "commentId": null,
    "userImg": "https://example.com/avatar2.jpg",
    "userName": "測試用戶B",
    "storeName": "示範店鋪B",
    "type": "like",
    "read": true,
    "timestamp": "2025-01-03T12:30:00Z"
  },
  {
    "notificationId": "64f18e1b6e08a2001a1d9e03",
    "userId": "user123",
    "storeId": null,
    "commentId": "comment002",
    "userImg": null,
    "userName": "測試用戶C",
    "storeName": null,
    "type": "comment",
    "read": false,
    "timestamp": "2025-01-02T15:45:00Z"
  },
  {
    "notificationId": "64f18e1b6e08a2001a1d9e04",
    "userId": "user456",
    "storeId": "store003",
    "commentId": "comment003",
    "userImg": "https://example.com/avatar3.jpg",
    "userName": "測試用戶D",
    "storeName": "示範店鋪C",
    "type": "like",
    "read": false,
    "timestamp": "2025-01-01T09:15:00Z"
  }
]

router.get("/test/:userId", (req, res) => {
  const { userId } = req.params;
  const userNotifications = testNotification.filter(notification => notification.userId === userId);
  res.json(userNotifications);
});

module.exports = router;
