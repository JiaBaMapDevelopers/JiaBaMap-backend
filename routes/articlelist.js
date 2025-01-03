const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articlelistController');

// 獲取所有文章
router.get('/', articleController.getAllArticles);

// 創建新文章
router.post('/', articleController.createArticle);

// 文章按讚/取消按讚
router.post('/:id/like', articleController.toggleLike);

// 添加評論
router.post('/:id/comments', articleController.addComment);

// 刪除評論
router.delete('/:articleId/comments/:commentId', articleController.deleteComment);

// 評論按讚/取消按讚
router.post('/:articleId/comments/:commentId/like', articleController.toggleCommentLike);

// 添加回覆
router.post('/:articleId/comments/:commentId/replies', articleController.addReply);

// 刪除回覆
router.delete('/:articleId/comments/:commentId/replies/:replyId', articleController.deleteReply);

// 回覆按讚/取消按讚
router.post('/:articleId/comments/:commentId/replies/:replyId/like', articleController.toggleReplyLike);

module.exports = router;
