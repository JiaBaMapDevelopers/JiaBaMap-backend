const mongoose = require("mongoose");
const Menu = require("../models/menuModel");

mongoose.connect("mongodb://localhost:27017/tests");

const seedMenu = async () => {
  const restaurant1PlaceId = "ChIJN1t_tDeuEmsRUsoyG83frY4";
  const restaurant2PlaceId = "ChIJN1t_tDeuEmsRUsoyG83frY5";

  const menuItems = [
    // 餐廳 1 的菜單項目
    {
      name: "漢堡",
      price: 150,
      category: "主餐",
      placeId: restaurant1PlaceId, // 餐廳 1 的 placeId
      itemId: 1,
    },
    {
      name: "薯條",
      price: 50,
      category: "小吃",
      placeId: restaurant1PlaceId, // 餐廳 1 的 placeId
      itemId: 2,
    },
    // 餐廳 2 的菜單項目
    {
      name: "義大利麵",
      price: 200,
      category: "主餐",
      placeId: restaurant2PlaceId, // 餐廳 2 的 placeId
      itemId: 3,
    },
    {
      name: "沙拉",
      price: 80,
      category: "小吃",
      placeId: restaurant2PlaceId, // 餐廳 2 的 placeId
      itemId: 4,
    },
  ];

  await Menu.insertMany(menuItems);
  console.log("種子資料插入成功");
  mongoose.connection.close();
};

seedMenu();
