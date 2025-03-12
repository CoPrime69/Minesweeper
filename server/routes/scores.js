const express = require('express');
const router = express.Router();
const Score = require('../models/Score');
const { protect } = require('../middleware/auth');

// Save a new score
router.post('/', protect, async (req, res) => {
  try {
    const { difficulty, time, score } = req.body;
    
    const newScore = await Score.create({
      user: req.user._id,
      difficulty,
      time,
      score
    });
    
    res.status(201).json({
      success: true,
      data: newScore
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's personal best scores
router.get('/personal-best', protect, async (req, res) => {
  try {
    const scores = await Score.find({ user: req.user._id })
      .sort({ difficulty: 1, score: -1 })
      .limit(15);
    
    res.status(200).json({
      success: true,
      data: scores
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get top scores by difficulty
router.get('/leaderboard/:difficulty', async (req, res) => {
  try {
    const { difficulty } = req.params;
    
    const scores = await Score.find({ difficulty })
      .sort({ score: -1 })
      .limit(10)
      .populate('user', 'username');
    
    res.status(200).json({
      success: true,
      data: scores
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
