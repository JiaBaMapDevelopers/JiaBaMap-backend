const mongoose = require("mongoose");
const Store = require("../models/storeModel");

mongoose.connect("mongodb://localhost:27017/tests");

const seedStores = async () => {
  const stores = [
    {
      name: "美味漢堡店",
      address: "台北市大安區信義路",
      businessHours: {
        Monday: "09:00-21:00",
        Tuesday: "09:00-21:00",
        Wednesday: "09:00-21:00",
        Thursday: "09:00-21:00",
        Friday: "09:00-21:00",
        Saturday: "10:00-22:00",
        Sunday: "10:00-22:00",
      },
      phone: "02-1234-5678",
      image: "https://example.com/image1.jpg",
      taxId: "12345678",
      paymentOptions: ["online", "cash"],
      description: "提供美味漢堡的專家",
      placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
    },
    {
      name: "義大利麵之家",
      address: "台中市西屯區中港路",
      businessHours: {
        Monday: "10:00-22:00",
        Tuesday: "10:00-22:00",
        Wednesday: "10:00-22:00",
        Thursday: "10:00-22:00",
        Friday: "10:00-22:00",
        Saturday: "11:00-23:00",
        Sunday: "11:00-23:00",
      },
      phone: "04-5678-1234",
      image: "https://example.com/image2.jpg",
      taxId: "87654321",
      paymentOptions: ["online", "cash"],
      description: "正宗義大利麵料理",
      placeId: "ChIJN1t_tDeuEmsRUsoyG83frY5",
    },
  ];

  await Store.insertMany(stores);
  console.log("餐廳種子資料插入成功");
  mongoose.connection.close();
};

seedStores();
