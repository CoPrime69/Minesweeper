# Minesweeper Platform

A modern, full-stack implementation of the classic Minesweeper game with user authentication, leaderboards, and admin dashboard.

![Minesweeper Platform](https://i.imgur.com/placeholder-image.png)

## 📋 Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Game Rules](#game-rules)
- [Admin Features](#admin-features)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **Classic Minesweeper Gameplay**: Enjoy the timeless puzzle game with three difficulty levels
- **User Authentication**: Register, login, and maintain your game history
- **Leaderboards**: Compete with other players and check your ranking
- **Personal Statistics**: Track your progress and personal best scores
- **Admin Dashboard**: Comprehensive analytics and user management (for admins)
- **Responsive Design**: Play on any device with a fully responsive UI
- **Score System**: Points awarded for successful games and even consolation points for incomplete games

## 🛠️ Technology Stack

### Frontend
- React.js (with TypeScript)
- React Router for navigation
- Axios for API requests
- Tailwind CSS for styling
- React Toastify for notifications
- Recharts for data visualization
- Styled Components for component styling

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- Express Rate Limit for API security

## 📂 Project Structure

minesweeper-platform/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   └── src/
│       ├── components/     # Reusable React components
│       ├── contexts/       # React context providers
│       ├── pages/          # Page components
│       ├── services/       # API services
│       └── utils/          # Utility functions
└── server/                 # Backend Node.js application
    ├── middleware/         # Express middleware
    ├── models/             # Mongoose data models
    ├── routes/             # API routes
    ├── scripts/            # Utility scripts
    └── server.js           # Main server entry point