const Store = require("../models/storeModel");

//新增店家
const createStore = async (req, res) => {
  try {
    const {
      name,
      address,
      businessHours,
      phone,
      image,
      taxId,
      paymentOptions,
      description,
      placeId,
    } = req.body;

    const store = new Store({
      name,
      address,
      businessHours,
      phone,
      image,
      taxId,
      paymentOptions,
      description,
      placeId,
    });
    const savedStore = await store.save();

    res.status(201).json({
      message: "餐廳新增成功",
      store: savedStore,
    });
  } catch (error) {
    console.log("建立餐廳失敗：", error);
    res.status(500).json({ message: "餐廳新增失敗，請稍後再試" });
  }
};

const getStore = async (req, res) => {
  const getStore = await Store.find()
  res.status(200).json(getStore)
}

const getStoreByPlace = async (req, res) => {
  const { placeId }  = req.params
  const getStore = await Store.find({placeId: placeId})
  res.status(200).json(getStore)
}
module.exports = {
  createStore,
  getStore,
  getStoreByPlace,
};
