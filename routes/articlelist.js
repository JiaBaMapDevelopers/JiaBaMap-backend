const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articlelistController');
const notificationMiddleWare  = require('../middlewares/notificationMiddleWare');

// 獲取所有食記
router.get('/', articleController.getAllArticles);

// 新增食記
router.post('/', articleController.createArticle);

// 刪除食記
router.delete('/:id', articleController.deleteArticle);

// 文章按讚/取消按讚
router.post('/:id/like', articleController.toggleLike, notificationMiddleWare.notifyOnArticleLike);

// 添加評論
router.post('/:id/comments', articleController.addComment, notificationMiddleWare.notifyOnCommentCreate);

// 刪除評論
router.delete('/:articleId/comments/:commentId', articleController.deleteComment);

// 評論按讚/取消按讚
router.post('/:articleId/comments/:commentId/like', articleController.toggleCommentLike, notificationMiddleWare.notifyOnCommentLike);

// 添加回覆
router.post('/:articleId/comments/:commentId/replies', articleController.addReply, notificationMiddleWare.notifyOnArticleReplyCreate);

// 刪除回覆
router.delete('/:articleId/comments/:commentId/replies/:replyId', articleController.deleteReply);

// 回覆按讚/取消按讚
router.post('/:articleId/comments/:commentId/replies/:replyId/like', articleController.toggleReplyLike, notificationMiddleWare.notifyOnArticleReplyLike);

router.get('/published/:userId', articleController.getPublishedArticles);

// 獲取單篇食記
router.get('/:id', articleController.getArticleById);

// 修改已發布食記
router.patch('/:id', articleController.updateArticle);

module.exports = router;
