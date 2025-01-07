const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    storeName: {
      type: String,
    },
    storeAddress: {
      type: String,
    },
    storePhone: {
      type: String,
      trim: true,
    },
    storeIntro: {
      type: String,
    },
    storeTaxId: {
      type: String,
    },
    contactName: {
      type: String,
    },
    contactEmail: {
      type: String,
    },
    contactPhone: {
      type: String,
    },
    placeId: {
      type: String,
    },
    businessHours: {
      type: Map, //類似JS的字典
      of: String, //指定每個值的型別
    },
    image: {
      type: [String],
      default: [],
    },
    createAt: {
      type: Date,
      default: Date.now,
    },
    updateAt: {
      type: Date,
      default: Date.now,
    },
    paymentOptions: {
      type: [String], //e.g. ["online", "cash"]
    },
  },
  {
    timestamps: true, //自動管理 createdAt 和 updatedAt
  },
);

module.exports = mongoose.model("Store", storeSchema);
