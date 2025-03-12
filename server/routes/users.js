const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Get current user profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { username, email } = req.body;
    
    // Check if username or email is already taken
    if (username || email) {
      const existingUser = await User.findOne({
        $and: [
          { _id: { $ne: req.user._id } },
          { $or: [
            { username: username || '' },
            { email: email || '' }
          ]}
        ]
      });
      
      if (existingUser) {
        if (email && existingUser.email === email) {
          return res.status(400).json({ message: 'Email already in use' });
        }
        if (username && existingUser.username === username) {
          return res.status(400).json({ message: 'Username already taken' });
        }
      }
    }
    
    // Fields to update
    const fieldsToUpdate = {};
    if (username) fieldsToUpdate.username = username;
    if (email) fieldsToUpdate.email = email;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Change password
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Get user with password
    const user = await User.findById(req.user._id).select('+password');
    
    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;