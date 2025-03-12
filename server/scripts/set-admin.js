const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/minesweeper')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Get User model
const User = require('../models/User');

async function setAdmin() {
  try {
    // Update user
    const result = await User.updateOne(
      { email: "prakhars2558@gmail.com" },
      { $set: { role: "admin" } }
    );
    
    if (result.matchedCount === 0) {
      console.log('User not found. Make sure the email is correct and the user exists.');
    } else if (result.modifiedCount === 0) {
      console.log('User found but role was already set to admin.');
    } else {
      console.log('User role updated to admin successfully!');
    }
  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    // Close MongoDB connection
    mongoose.connection.close();
  }
}

// Run the function
setAdmin();