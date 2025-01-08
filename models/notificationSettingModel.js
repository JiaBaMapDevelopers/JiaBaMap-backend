const mongoose = require("mongoose");

const notificationSettingSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true
  },
  preferences: {
    comments: { type: Boolean, default: true },
    likes: { type: Boolean, default: true },
    replies: { type: Boolean, default: true },
    mentions: { type: Boolean, default: true },
    follows: { type: Boolean, default: true }
  },
  emailNotifications: {
    enabled: { type: Boolean, default: false },
    frequency: {
      type: String,
      enum: ['immediate', 'daily', 'weekly', 'never'],
      default: 'never'
    }
  }
}, {
  timestamps: true
});

// 創建用戶默認通知設置
notificationSettingSchema.statics.createDefaultSettings = async function(userId) {
  try {
    const settings = await this.findOne({ userId });
    if (!settings) {
      return await this.create({ userId });
    }
    return settings;
  } catch (error) {
    console.error('Error creating default notification settings:', error);
    throw error;
  }
};

// 更新通知偏好設置
notificationSettingSchema.statics.updatePreferences = async function(userId, preferences) {
  try {
    return await this.findOneAndUpdate(
      { userId },
      { $set: { preferences } },
      { new: true, upsert: true }
    );
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    throw error;
  }
};

module.exports = mongoose.model("NotificationSetting", notificationSettingSchema);