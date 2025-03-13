const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'expert'],
    required: true
  },
  time: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  won: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { 
  // Add this option to ensure indexes are created
  autoIndex: true 
});

// Define indexes - make sure to include explicit names for tracking in Atlas
ScoreSchema.index({ user: 1, difficulty: 1, score: -1, won: 1 }, { 
  name: 'user_difficulty_score_won_idx' 
});

// Add a dedicated index just for the 'won' field
ScoreSchema.index({ won: 1 }, { 
  name: 'won_idx', 
  background: true
});

module.exports = mongoose.model('Score', ScoreSchema);