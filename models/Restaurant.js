const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  googlePlaceId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number
  },
  address: {
    type: String
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],  // [longitude, latitude]
      required: true
    }
  },
  priceLevel: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 創建地理空間索引
restaurantSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Restaurant', restaurantSchema); 