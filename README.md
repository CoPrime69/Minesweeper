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
- **Difficulty Levels**: Choose from Easy, Medium, Hard, or create custom board sizes
- **Timer and Score Tracking**: Keep track of your best times and scores
<!-- - **First-click Protection**: Never hit a mine on your first click
- **Customizable Themes**: Multiple visual themes to choose from
- **Save/Load Game**: Pause and resume your game later
- **Hints System**: Get help when you're stuck with limited hints
- **Sound Effects**: Toggle-able audio feedback
- **Flagging System**: Mark potential mines with flags or question marks
- **Touchscreen Support**: Play on mobile devices with optimized controls
- **Accessibility Features**: Color blind mode and keyboard navigation
- **Undo Feature**: Revert your last move (in casual mode only) -->

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

```
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
```

## 🚀 Installation

### Prerequisites

- Node.js (v14+)
- MongoDB
- npm or yarn

### Setting up the Client

```bash
# Navigate to the client directory
cd client

# Install dependencies
npm install

# Create a .env file in the client directory (see Environment Variables section)
```

### Setting up the Server

```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create a .env file in the server directory (see Environment Variables section)
```

### Steps

1. Clone the repository:

   ```
   git clone https://github.com/username/minesweeper-platform.git
   cd minesweeper-platform
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## How to Play

1. **Objective**: Uncover all cells that don't contain mines
2. **Left-click**: Reveal a cell
3. **Right-click**: Place a flag (to mark a potential mine)
4. **Double-click**: Reveal surrounding cells (when surrounding flags match the number)

### Game Rules

- Numbers indicate how many mines are adjacent to that cell
- Use logic to determine which cells are safe to click
- Flag all mines correctly to win the game

## Admin Features

- **User Management**: Add, edit, and delete users
- **Game Analytics**: View detailed game statistics and user activity
- **Content Management**: Manage game content and settings

## API Endpoints

- **User Authentication**: Register, login, and logout endpoints
- **Game Data**: Fetch and update game data
- **Leaderboards**: Retrieve leaderboard information
- **Admin Actions**: Perform admin-specific actions

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the classic Microsoft Minesweeper
- Thanks to all contributors who have helped improve this project
