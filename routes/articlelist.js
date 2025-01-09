const express = require("express");
const multer = require("multer");
const router = express.Router();
const cors = require('cors');
const articleController = require('../controllers/articlelistController');

// 使用與 app.js 相同的 corsOptions
const corsOptions = {
  origin: function(origin, callback) {
    const allowedOrigins = [
      'https://jiabamap.up.railway.app',
      'http://localhost:3000',
      'https://accounts.google.com',
      'http://localhost:5173'
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

// 設定 multer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
});

// 獲取所有文章
<<<<<<< HEAD
router.get('/', cors(corsOptions), articleController.getAllArticles);

// 創建新文章
router.post('/', cors(corsOptions), upload.array("photo"), articleController.createArticle);

// 刪除食記
router.delete('/:id', cors(corsOptions), articleController.deleteArticle);

// 文章按讚/取消按讚
router.post('/:id/like', cors(corsOptions), articleController.toggleLike);

// 添加評論
router.post('/:id/comments', cors(corsOptions), articleController.addComment);

// 刪除評論
router.delete('/:articleId/comments/:commentId', cors(corsOptions), articleController.deleteComment);

// 評論按讚/取消按讚
router.post('/:articleId/comments/:commentId/like', cors(corsOptions), articleController.toggleCommentLike);

// 添加回覆
router.post('/:articleId/comments/:commentId/replies', cors(corsOptions), articleController.addReply);

// 刪除回覆
router.delete('/:articleId/comments/:commentId/replies/:replyId', cors(corsOptions), articleController.deleteReply);

// 回覆按讚/取消按讚
router.post('/:articleId/comments/:commentId/replies/:replyId/like', cors(corsOptions), articleController.toggleReplyLike);

router.get('/published/:userId', cors(corsOptions), articleController.getPublishedArticles);

// 獲取單篇食記
router.get('/:id', cors(corsOptions), articleController.getArticleById);

// 修改已發布食記
router.patch('/:id', cors(corsOptions), articleController.updateArticle);

// 處理預檢請求
router.options('*', cors(corsOptions));
=======
router.get("/", articleController.getAllArticles);

// 創建新文章
router.post("/", upload.array("photo"), articleController.createArticle);

// 刪除食記
router.delete("/:id", articleController.deleteArticle);

// 文章按讚/取消按讚
router.post(
  "/:id/like",
  articleController.toggleLike,
  notificationMiddleWare.notifyOnArticleLike,
);

// 添加評論
router.post(
  "/:id/comments",
  articleController.addComment,
  notificationMiddleWare.notifyOnCommentCreate,
);

// 刪除評論
router.delete(
  "/:articleId/comments/:commentId",
  articleController.deleteComment,
);

// 評論按讚/取消按讚
router.post(
  "/:articleId/comments/:commentId/like",
  articleController.toggleCommentLike,
  notificationMiddleWare.notifyOnCommentLike,
);

// 添加回覆
router.post(
  "/:articleId/comments/:commentId/replies",
  articleController.addReply,
  notificationMiddleWare.notifyOnArticleReplyCreate,
);

// 刪除回覆
router.delete(
  "/:articleId/comments/:commentId/replies/:replyId",
  articleController.deleteReply,
);

// 回覆按讚/取消按讚
router.post(
  "/:articleId/comments/:commentId/replies/:replyId/like",
  articleController.toggleReplyLike,
  notificationMiddleWare.notifyOnArticleReplyLike,
);

router.get("/published/:userId", articleController.getPublishedArticles);

// 獲取單篇食記
router.get("/:id", articleController.getArticleById);

// 修改已發布食記
router.patch("/:id", articleController.updateArticle);
>>>>>>> origin/dev

module.exports = router;
