const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, //去除空格
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    businessHours: {
      type: Map, //類似JS的字典
      of: String, //指定每個值的型別
      required: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
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
    taxId: {
      //統一編號
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    paymentOptions: {
      type: [String], //e.g. ["online", "cash"]
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    placeId: {
      //Google Place ID
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true, //自動管理 createdAt 和 updatedAt
  },
);

module.exports = mongoose.model("Store", storeSchema);
