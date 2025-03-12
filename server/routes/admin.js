const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Score = require('../models/Score');
const { protect, authorize } = require('../middleware/auth');

// Get all users (admin only)
router.get('/users', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user details (admin only)
router.get('/users/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user role (admin only)
router.put('/users/:id/role', protect, authorize('admin'), async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user (admin only)
router.delete('/users/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Delete user's scores
    await Score.deleteMany({ user: req.params.id });
    
    // Delete user - fix the deprecated method
    await User.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all scores (admin only)
router.get('/scores', protect, authorize('admin'), async (req, res) => {
  try {
    const scores = await Score.find()
      .populate('user', 'username email')
      .sort({ date: -1 });
    
    res.status(200).json({
      success: true,
      count: scores.length,
      data: scores
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get game statistics (admin only)
router.get('/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalGames = await Score.countDocuments();
    
    const difficultyStats = await Score.aggregate([
      {
        $group: {
          _id: '$difficulty',
          count: { $sum: 1 },
          avgTime: { $avg: '$time' },
          avgScore: { $avg: '$score' }
        }
      }
    ]);
    
    const dailyActivity = await Score.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 7 }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalGames,
        difficultyStats,
        dailyActivity
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
