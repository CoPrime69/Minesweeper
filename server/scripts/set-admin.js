const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('Please provide an email address as an argument.');
  console.log('Usage: node scripts/set-admin.js your@email.com');
  process.exit(1);
}

// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  console.error('Please provide a valid email address.');
  process.exit(1);
}

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
      { email: email },
      { $set: { role: "admin" } }
    );
    
    if (result.matchedCount === 0) {
      console.log(`User with email ${email} not found. Make sure the email is correct and the user exists.`);
    } else if (result.modifiedCount === 0) {
      console.log(`User ${email} found but role was already set to admin.`);
    } else {
      console.log(`User ${email} role updated to admin successfully!`);
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