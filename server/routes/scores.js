const express = require('express');
const router = express.Router();
const Score = require('../models/Score');
const { protect } = require('../middleware/auth');

// Save a new score
router.post('/', protect, async (req, res) => {
  try {
    const { difficulty, time, score, won } = req.body;
    
    // Create the score document with the won field included
    const newScore = await Score.create({
      user: req.user._id,
      difficulty,
      time,
      score,
      won: !!won // Convert to boolean to ensure correct type
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
    // Remove the global limit of 15
    const scores = await Score.find({ user: req.user._id })
      .sort({ date: -1 }) // Sort by date desc to get newest first
      .limit(100); // Increase limit substantially (or remove completely)
    
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
    
    // Make case-insensitive query
    const scores = await Score.find({ 
      difficulty: { $regex: new RegExp('^' + difficulty + '$', 'i') } 
    })
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
