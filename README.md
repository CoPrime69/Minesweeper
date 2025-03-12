# Minesweeper Platform

A modern, full-stack implementation of the classic Minesweeper game with user authentication, leaderboards, and admin dashboard.

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
- [Troubleshooting](#troubleshooting)
- [Acknowledgments](#acknowledgments)

## ✨ Features

- **Classic Minesweeper Gameplay**: Enjoy the timeless puzzle game with three difficulty levels
- **User Authentication**: Register, login, and maintain your game history
- **Leaderboards**: Compete with other players and check your ranking
- **Personal Statistics**: Track your progress and personal best scores
- **Admin Dashboard**: Comprehensive analytics and user management (for admins)
- **Responsive Design**: Play on any device with a fully responsive UI
- **Score System**: Points awarded for successful games and even consolation points for incomplete games
- **Difficulty Levels**: Choose from Beginner, Intermediate, Expert, or create custom board sizes
- **Timer and Score Tracking**: Keep track of your best times and scores
- **Flagging System**: Mark potential mines with flags or question marks

### Features to be added
- **First-click Protection**: Never hit a mine on your first click
- **Customizable Themes**: Multiple visual themes to choose from
- **Save/Load Game**: Pause and resume your game later
- **Hints System**: Get help when you're stuck with limited hints
- **Sound Effects**: Toggle-able audio feedback
- **Touchscreen Support**: Play on mobile devices with optimized controls
- **Accessibility Features**: Color blind mode and keyboard navigation
- **Undo Feature**: Revert your last move (in casual mode only)

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

### DevOps
- Render for backend hosting
- Vercel for frontend hosting
- MongoDB Atlas for database

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

## 📥 Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Clone the Repository
```bash
git clone https://github.com/yourusername/minesweeper-platform.git
cd minesweeper-platform
```

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

## 🔧 Environment Setup

### Server (.env file in /server directory)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/minesweeper
# or your MongoDB Atlas URI
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d
```

### Client (.env file in /client directory)
```
REACT_APP_API_URL=http://localhost:5000/api
# For production: https://minesweeper-backend-o698.onrender.com/api
```

## 🚀 Running the Application

### Development Mode

#### Start the Backend Server
```bash
cd server
npm run dev
```

#### Start the Frontend Client
```bash
cd client
npm start
```

The frontend will be available at http://localhost:3000 and backend at http://localhost:5000.

### Production Mode

#### Build the Frontend
```bash
cd client
npm run build
```

#### Start the Backend (which will serve the built frontend)
```bash
cd server
npm start
```

## 🎮 Game Rules

1. **Objective**: Uncover all non-mine cells on the board without clicking on a mine.
2. **Controls**:
   - Left-click: Reveal a cell
   - Right-click: Place/remove a flag on a suspected mine
   - Double-click: Reveal surrounding cells (when surrounding flags match the number) (To be added)
3. **Cell Types**:
   - Empty cells (no adjacent mines): Clicking reveals neighboring cells automatically
   - Numbered cells: Show how many mines are in the adjacent 8 cells
   - Mine cells: Clicking ends the game
4. **Winning**: Successfully reveal all safe cells without triggering any mines
5. **Scoring System**:
   - Base scores vary by difficulty (Beginner: 100, Intermediate: 250, Expert: 400)
   - Time penalties reduce your score the longer you take
   - Efficiency bonuses for correctly using flags
   - Consolation scores for lost games based on estimated progress
6. **Special Features** (To be added):
   - First-click protection ensures you never hit a mine on your first click
   - Use flags to mark potential mines and question marks for cells you're unsure about
   - Use hints when you're stuck (limited number available) 

## 👑 Admin Features

To create an admin user, run the provided script:
```bash
cd server
node scripts/set-admin.js your@email.com
```

Admin users have access to:
- User management (view, update roles, delete)
- Global score statistics
- Platform usage analytics
- Game content and settings management

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user profile

### Scores
- `POST /api/scores` - Save a new score
- `GET /api/scores/personal-best` - Get a user's personal best scores
- `GET /api/scores/leaderboard/:difficulty` - Get leaderboard for a specific difficulty

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/users/:id` - Get a specific user's details (admin only)
- `PUT /api/admin/users/:id/role` - Update a user's role (admin only)
- `DELETE /api/admin/users/:id` - Delete a user (admin only)
- `GET /api/admin/scores` - Get all scores (admin only)
- `GET /api/admin/stats` - Get platform statistics (admin only)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔧 Troubleshooting

### Common Issues

1. **API Connection Issues**
   - Check that your .env file has the correct API URL
   - Ensure CORS is properly configured in the backend

2. **Missing Environment Variables**
   - Make sure all required environment variables are set
   - For React environment variables, remember they must start with REACT_APP_

3. **Game Rendering Problems**
   - Clear browser cache and reload
   - Check browser console for errors

## 🙏 Acknowledgments

- Inspired by the classic Microsoft Minesweeper
- Thanks to all contributors who have helped improve this project

Created with ❤️ by [Your Name]