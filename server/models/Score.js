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
  completed: {
    type: Boolean,
    default: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
ScoreSchema.index({ user: 1, difficulty: 1, score: -1 });

module.exports = mongoose.model('Score', ScoreSchema);