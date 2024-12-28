const Article = require('../models/articlelistModel');

exports.getAllArticles = async (_req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createArticle = async (req, res) => {
  try {
    const { userId, placeId, title, content, photo, location, price, openHours, user } = req.body;

    if (!userId || !placeId || !title || !content) {
      return res.status(400).json({ 
        message: "UserId, placeId, title, and content are required" 
      });
    }

    const article = new Article({
      userId,
      placeId,
      title,
      content,
      user,
      photo,
      location,
      price,
      openHours
    });

    const savedArticle = await article.save();
    res.status(201).json(savedArticle);
  } catch (error) {
    res.status(400).json({ message: "Cannot create a new article" });
  }
};



exports.deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 只刪除指定的文章
    await Article.findByIdAndDelete(id);
    
    res.status(200).json({
      message: '文章已成功刪除'
    });
  } catch (error) {
    res.status(500).json({ 
      message: '刪除文章時發生錯誤'
    });
  }
};


// 通用的按讚處理函數
const handleLike = async (doc, userId) => {
  const isLiked = doc.likedBy.includes(userId);
  
  if (isLiked) {
    // 取消按讚
    doc.likedBy = doc.likedBy.filter(id => id !== userId);
    doc.likesCount = Math.max(0, doc.likesCount - 1);
  } else {
    // 添加按讚
    doc.likedBy.push(userId);
    doc.likesCount++;
  }
  
  return {
    isLiked: !isLiked,
    likesCount: doc.likesCount
  };
};

// 文章按讚
exports.toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'UserId is required' });
    }

    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const result = await handleLike(article, userId);
    await article.save();

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




exports.addComment = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // 從請求體中獲取評論資料
    const { content, userId, user, userPhoto } = req.body;
    console.log('收到的評論數據:', { content, userId, user, userPhoto });

    // 驗證必要欄位
    if (!content || !userId || !user) {
      return res.status(400).json({ 
        message: 'Content, userId, and user are required' 
      });
    }

    // 創建新評論
    const newComment = {
      content: content.trim(),
      userId,
      user,
      userPhoto: userPhoto || '',
      createdAt: new Date(),
      likedBy: [],
      likesCount: 0,
      replies: []
    };
    // 添加評論到文章
    article.comments.push(newComment);
    article.updatedAt = new Date();
    await article.save();
    
    // 返回新創建的評論
    const createdComment = article.comments[article.comments.length - 1];
    console.log('保存後的評論:', createdComment);
    // 返回與前端格式匹配的資料，確保包含 user 字段
    res.status(201).json({
      _id: createdComment._id,
      content: createdComment.content,
      userId: createdComment.userId,
      user: createdComment.user,
      userPhoto: createdComment.userPhoto,
      createdAt: createdComment.createdAt,
      likesCount: 0,
      isLiked: false,
      replies: []
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const article = await Article.findById(req.params.articleId);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const commentIndex = article.comments.findIndex(
      comment => comment._id.toString() === req.params.commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    article.comments.splice(commentIndex, 1);
    await article.save();
    
    res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 評論按讚
exports.toggleCommentLike = async (req, res) => {
  try {
    const { articleId, commentId } = req.params;
    const { userId } = req.body;

    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const comment = article.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const result = await handleLike(comment, userId);
    await article.save();

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addReply = async (req, res) => {
  try {
    const article = await Article.findById(req.params.articleId);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const comment = article.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // 從請求中獲取回覆資料
    const { content, userId, user, userPhoto } = req.body;

    // 驗證必要欄位
    if (!content || !userId || !user) {
      return res.status(400).json({ 
        message: 'Content, userId, and user are required' 
      });
    }

    // 創建新回覆
    const newReply = {
      content: content.trim(),
      userId,
      user,
      userPhoto: userPhoto || '',
      createdAt: new Date(),
      likedBy: [],
      likesCount: 0
    };

    // 添加回覆到評論
    comment.replies.push(newReply);
    article.updatedAt = new Date();
    await article.save();
    
    // 獲取新創建的回覆
    const createdReply = comment.replies[comment.replies.length - 1];
    
    // 返回與前端格式匹配的資料
    res.status(201).json({
      _id: createdReply._id,
      content: createdReply.content,
      userId: createdReply.userId,
      user: createdReply.user,
      userPhoto: createdReply.userPhoto,
      createdAt: createdReply.createdAt,
      likesCount: 0,
      isLiked: false
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteReply = async (req, res) => {
  try {
    const { articleId, commentId, replyId } = req.params;

    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const comment = article.comments.find(c => c._id.toString() === commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // 找到要刪除的回覆的索引
    const replyIndex = comment.replies.findIndex(
      reply => reply._id.toString() === replyId
    );

    if (replyIndex === -1) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    // 刪除回覆
    comment.replies.splice(replyIndex, 1);
    await article.save();
    
    // 返回成功訊息
    res.status(200).json({ 
      message: '回覆已刪除'
    });

  } catch (error) {
    console.error('Delete reply error:', error);
    res.status(500).json({ message: error.message });
  }
};

// 回覆按讚
exports.toggleReplyLike = async (req, res) => {
  try {
    const { articleId, commentId, replyId } = req.params;
    const { userId } = req.body;

    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const comment = article.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const reply = comment.replies.id(replyId);
    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    const result = await handleLike(reply, userId);
    await article.save();

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
