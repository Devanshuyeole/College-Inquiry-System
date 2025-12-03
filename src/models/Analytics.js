import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  totalQueries: {
    type: Number,
    default: 0
  },
  uniqueSessions: {
    type: Number,
    default: 0
  },
  popularCategories: [{
    category: String,
    count: Number
  }]
}, {
  timestamps: true
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

export default Analytics;