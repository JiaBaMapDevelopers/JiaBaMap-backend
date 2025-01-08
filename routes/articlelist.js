const express = require('express');
const multer = require("multer");
const router = express.Router();
const articleController = require('../controllers/articlelistController');
const notificationController  = require('../controllers/notificationController');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
});


// 通知中間件
const createNotificationMiddleware = (type) => async (req, res, next) => {
  try {
    console.log('通知中間件開始處理:', { 
      type, 
      body: req.body, 
      params: req.params 
    });

    let notificationData = {};

    // 根據不同類型設置接收者
    switch (type) {
      case 'article_like':
        notificationData = {
          receiverId: req.body.userId,      // 文章作者 ID
          relatedId: req.params.id,         // 文章 ID
          additionalData: {
            articleId: req.params.id
          }
        };
        break;
      case 'article_comment':
      case 'article_comment_like':
      case 'article_reply':
        notificationData = {
          receiverId: req.body.userId,
          relatedId: req.params.id || req.params.articleId,
          additionalData: {
            content: req.body.content
          }
        };
        break;
    }

    const notification = await notificationController.handleNotification(
      type,
      notificationData,
      req
    );

    console.log('通知創建結果:', notification);
    res.locals.notification = notification;
    next();
  } catch (error) {
    console.error('通知中間件錯誤:', error);
    next();
  }
};

// 獲取所有文章
router.get('/', articleController.getAllArticles);

// 創建新文章
router.post('/',upload.array("photo"), articleController.createArticle);

// 刪除食記
router.delete('/:id', articleController.deleteArticle);

// 文章按讚/取消按讚
router.post('/:id/like', articleController.toggleLike, createNotificationMiddleware('article_like'));

// 添加評論
router.post('/:id/comments', articleController.addComment, createNotificationMiddleware('article_comment'));

// 刪除評論
router.delete('/:articleId/comments/:commentId', articleController.deleteComment);

// 評論按讚/取消按讚
router.post('/:articleId/comments/:commentId/like', articleController.toggleCommentLike, createNotificationMiddleware('article_comment_like'));

// 添加回覆
router.post('/:articleId/comments/:commentId/replies', articleController.addReply, createNotificationMiddleware('article_reply'));

// 刪除回覆
router.delete('/:articleId/comments/:commentId/replies/:replyId', articleController.deleteReply);

// 回覆按讚/取消按讚
router.post('/:articleId/comments/:commentId/replies/:replyId/like', articleController.toggleReplyLike);

router.get('/published/:userId', articleController.getPublishedArticles);

// 獲取單篇食記
router.get('/:id', articleController.getArticleById);

// 修改已發布食記
router.patch('/:id', articleController.updateArticle);

module.exports = router;
