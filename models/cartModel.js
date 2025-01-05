const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
    },
    stores: [
        {
        storeId: {
            type: String,
            unique: true,
        },
        storeName: {
            type: String,
            unique: true,
        },
        items: [
            {
                productId: { type: String },
                name: { type: String },
                price: { type: Number },
                quantity: { type: Number }
            }
        ],
        tiotal: {
            type: Number, default: 0
        }
    }
],
    
})

module.exports = mongoose.model("Cart", cartSchema);