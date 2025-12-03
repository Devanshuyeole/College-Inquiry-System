import mongoose from 'mongoose';

const querySchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  userName: {
    type: String,
    default: 'Anonymous'
  },
  userEmail: {
    type: String,
    default: ''
  },
  userQuery: {
    type: String,
    required: true
  },
  botResponse: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  category: {
    type: String,
    default: 'general'
  },
  userInfo: {
    ipAddress: String,
    userAgent: String
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
querySchema.index({ timestamp: -1 });
querySchema.index({ category: 1 });
querySchema.index({ sessionId: 1, timestamp: 1 });
querySchema.index({ userName: 1 });

const Query = mongoose.model('Query', querySchema);

export default Query;