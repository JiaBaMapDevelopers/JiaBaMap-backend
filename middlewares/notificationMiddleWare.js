const notificationController = require("../controllers/notificationController");

// 新增評論後觸發通知
const notifyOnCommentCreate = async (req, res, next) => {
  const { userId, placeId, content } = req.body;

  try {
    // 確保新增評論的邏輯已執行成功，從 `res.locals` 中獲取保存的評論
    const newComment = res.locals.savedComment;

    // 創建通知
    await notificationController.createNotification({
      receiverId: placeId, 
      actionUserId: userId,
      actionType: "comment",
      relatedId: newComment._id,
      relatedType: "comment",
    });

    console.log("通知已創建");
    next();
  } catch (error) {
    console.error("創建通知失敗:", error);
    next(error); // 將錯誤傳遞到全局錯誤處理器
  }
};

// 更新評論讚數後觸發通知
const notifyOnLikeUpdate = async (req, res, next) => {
  const { id: commentId } = req.params;
  const { likes } = req.body;

  try {
    // 查詢評論的作者
    const comment = await Comment.findById(commentId);

    if (comment) {
      // 創建通知
      await notificationController.createNotification({
        receiverId: comment.userId, // 評論的作者
        actionUserId: req.user.id, // 操作的用戶
        actionType: "like",
        relatedId: commentId,
        relatedType: "comment",
      });

      console.log("通知已創建");
    }

    next();
  } catch (error) {
    console.error("創建通知失敗:", error);
    next(error); // 將錯誤傳遞到全局錯誤處理器
  }
};

module.exports = {
  notifyOnCommentCreate,
  notifyOnLikeUpdate,
};
