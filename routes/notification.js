const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notificationController');
const { verifyToken } = require('../controllers/authController');

// 獲取用戶通知列表 (需要驗證)
router.get('/notifications/:userId', 
  verifyToken, 
  (req, res) => NotificationController.getNotifications(req, res)
);

// 獲取用戶所有通知
router.get('/:userId', 
  (req, res) => NotificationController.getNotifications(req, res)
);

// 獲取未讀通知數量
router.get('/:userId/unread', 
  (req, res) => NotificationController.getUnreadCount(req, res)
);

// 標記通知為已讀
router.patch('/read/:notificationId', 
  (req, res) => NotificationController.markAsRead(req, res)
);

// 批量標記通知為已讀
router.patch('/:userId/read-multiple', 
  (req, res) => NotificationController.markMultipleAsRead(req, res)
);

// 店家相關通知路由
router.get('/place/:placeId/likes', 
  (req, res) => NotificationController.getPlaceLikeNotifications(req, res)
);

router.get('/place/:placeId/comments', 
  (req, res) => NotificationController.getPlaceCommentNotifications(req, res)
);

router.get('/place/:placeId/all', 
  (req, res) => NotificationController.getAllPlaceNotifications(req, res)
);

module.exports = router;