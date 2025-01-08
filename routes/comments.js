const express = require("express");
const multer = require("multer");
const router = express.Router();
const controller = require("../controllers/commentsController");
const notificationController = require("../controllers/notificationController");
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
});

const jwt = require('jsonwebtoken');

// routes/comments.js

const createNotificationMiddleware = (type) => async (req, res, next) => {
  try {
    // 添加調試日誌
    console.log('通知中間件收到的參數:', {
      type,
      body: req.body,
      params: req.params
    });

    const notification = await notificationController.handleNotification(
      type,
      {
        receiverId: req.body.userId,    
        relatedId: req.params.id,
        additionalData: {
          content: req.body.content
        }
      },
      req
    );
    
    res.locals.notification = notification;
    next();
  } catch (error) {
    console.error('通知中間件錯誤:', error);
    next(error);
  }
};


//依照餐廳的placeId搜尋所有評論
router.get(
  "/restaurant/:id",
  controller.getCommentsByRestaurant,
  /* 	
    #swagger.summary = 'Search comments of the same restaurant'
    #swagger.description = 'Endpoint to search comments based on the placeId'
    */

  /* 
    #swagger.parameters['placeId'] = {
      in: 'path',
      description: 'The placeId of restaurant',
      required: 'true',
      type: 'string',
    }
  */
);

//依照使用者userId搜尋所有評論
router.get(
  "/user/:id",
  controller.getCommentsByUser,
  /* 	
    #swagger.summary = 'Search comments of the same user'
    #swagger.description = 'Endpoint to search comments based on the userId'
    */

  /* 
    #swagger.parameters['userId'] = {
      in: 'path',
      description: 'The userId of user',
      required: 'true',
      type: 'string',
    }
  */
);

//新增一筆評論
router.post(
  "/",
  createNotificationMiddleware('comment'),
  upload.array("photos", 5),
  controller.createComment,
  createNotificationMiddleware('comment'),
  /* 
    #swagger.summary = 'Create a new comment'
    #swagger.description = 'Create a new comment for a specific place by a user. The comment includes userId, placeId, content, and rating.'
  */
  /* 
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'The details of the comment to be created.',
      required: true,
      schema: {
        userId: 'string',
        placeId: 'string',
        content: 'string',
        rating: 'number'
      }
    }
  */
);

//更新一筆評論
router.put(
  "/:id",
  upload.array("photos", 5),
  controller.updateComment,
  /* 	
    #swagger.summary = 'Update comment'
    #swagger.description = 'Update the comment'
    */

  /* 
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'The id of the comment',
      required: 'true',
      type: 'string',
    }
  */
);

//刪除一筆評論
router.delete(
  "/:id",
  controller.deleteComment,
  /* 	
    #swagger.summary = 'Delete comment'
    #swagger.description = 'Delete the comment'
    */

  /* 
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'The id of the comment',
      required: 'true',
      type: 'string',
    }
  */
);

//更新讚數
//body直接提供更新後的數字
router.put(
  "/likes/:id",
  createNotificationMiddleware('like'),
  controller.updateLikes,
  /* 	
    #swagger.summary = 'Update likes'
    #swagger.description = 'Update the likes of comment'
    */

  /* 
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'The id of the comment',
      required: 'true',
      type: 'string',
    }
  */
);

module.exports = router;
