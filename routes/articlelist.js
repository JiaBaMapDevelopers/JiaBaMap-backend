const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articlelistController');

// 獲取所有食記
router.get('/', articleController.getAllArticles);

// 新增食記
router.post('/', articleController.createArticle);

// 刪除食記
router.delete('/:id', articleController.deleteArticle);

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

router.get('/published/:userId', articleController.getPublishedArticles);

// 獲取單篇食記
router.get('/:id', articleController.getArticleById);

// 修改已發布食記
router.patch('/:id', articleController.updateArticle);

module.exports = router;
