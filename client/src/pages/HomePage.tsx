import React from 'react';
import { Link } from 'react-router-dom';

// Reuse the same color palette from Navbar for consistency
const COLORS = ['#FF6B6B', '#4ECDC4', '#FFD166', '#6A0572', '#AB83A1'];
const GRADIENT_START = '#5533FF';
const GRADIENT_END = '#2B8EFF';

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-12">
      {/* Hero Section with gradient background */}
      <div className="rounded-2xl shadow-xl mb-16 p-8 text-center text-white overflow-hidden relative" 
        style={{
          background: `linear-gradient(135deg, ${GRADIENT_START}, ${GRADIENT_END})`,
          borderBottom: `3px solid ${COLORS[0]}`
        }}>
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          {/* Background pattern */}
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full" style={{ backgroundColor: COLORS[2] }}></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full" style={{ backgroundColor: COLORS[0] }}></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full" style={{ backgroundColor: COLORS[1] }}></div>
        </div>
        
        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 font-black">MINE</span>
            <span className="font-medium ml-1">SWEEPER</span>
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Test your logic skills, compete with players worldwide, and climb the leaderboards in this modern take on the classic game.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link to="/play" 
              className="px-6 py-3 rounded-lg bg-white text-blue-600 font-bold tracking-wider shadow-lg transform hover:scale-105 transition-all duration-200">
              PLAY NOW
            </Link>
            <Link to="/leaderboard" 
              className="px-6 py-3 rounded-lg border-2 border-white text-white font-bold tracking-wider hover:bg-white hover:text-blue-600 transition-all duration-200">
              LEADERBOARDS
            </Link>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-200">
          <div className="h-2" style={{ backgroundColor: COLORS[0] }}></div>
          <div className="p-6 text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" 
              style={{ backgroundColor: COLORS[0] + '20' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke={COLORS[0]}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Play Now</h2>
            <p className="text-gray-600 mb-6">
              Choose from multiple difficulty levels and challenge yourself with our modern take on the classic Minesweeper game.
            </p>
            <Link to="/play" 
              className="inline-block px-5 py-2 rounded-lg text-white font-semibold transition-colors duration-200"
              style={{ backgroundColor: COLORS[0] }}>
              Start Playing
            </Link>
          </div>
        </div>
        
        <div className="rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-200">
          <div className="h-2" style={{ backgroundColor: COLORS[1] }}></div>
          <div className="p-6 text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" 
              style={{ backgroundColor: COLORS[1] + '20' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke={COLORS[1]}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Leaderboards</h2>
            <p className="text-gray-600 mb-6">
              Compare your skills with players worldwide and compete for the top spot on our global leaderboards.
            </p>
            <Link to="/leaderboard" 
              className="inline-block px-5 py-2 rounded-lg text-white font-semibold transition-colors duration-200"
              style={{ backgroundColor: COLORS[1] }}>
              View Rankings
            </Link>
          </div>
        </div>
        
        <div className="rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-200">
          <div className="h-2" style={{ backgroundColor: COLORS[2] }}></div>
          <div className="p-6 text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" 
              style={{ backgroundColor: COLORS[2] + '20' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke={COLORS[2]}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Your Profile</h2>
            <p className="text-gray-600 mb-6">
              Track your progress, view detailed statistics, and see your personal best scores across all difficulty levels.
            </p>
            <Link to="/profile" 
              className="inline-block px-5 py-2 rounded-lg text-white font-semibold transition-colors duration-200"
              style={{ backgroundColor: COLORS[2] }}>
              Go to Profile
            </Link>
          </div>
        </div>
      </div>
      
      {/* How to Play Section */}
      <div className="mt-16 rounded-xl shadow-lg p-8 max-w-5xl mx-auto" style={{
        background: `linear-gradient(to right, ${COLORS[1] + '10'}, ${COLORS[2] + '10'})`,
        borderLeft: `3px solid ${COLORS[1]}`,
      }}>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke={COLORS[1]}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          How to Play
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Game Rules</h3>
            <ul className="space-y-3">
              {[
                "Left-click to reveal a cell",
                "Right-click to flag a suspected mine",
                "Reveal all non-mine cells to win",
                "Avoid clicking on mines or you lose"
              ].map((rule, index) => (
                <li key={index} className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Difficulty Levels</h3>
            <ul className="space-y-3">
              {[
                {name: "Beginner", desc: "9x9 grid with 10 mines"},
                {name: "Intermediate", desc: "16x16 grid with 40 mines"},
                {name: "Expert", desc: "24x16 grid with 60 mines"}
              ].map((level, index) => (
                <li key={index} className="flex items-start">
                  <div className="h-5 w-5 mr-2 rounded-full flex-shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: COLORS[index] }}>
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                  <span className="text-gray-700">
                    <strong>{level.name}:</strong> {level.desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Link to="/play" 
            className="inline-block px-6 py-3 rounded-lg text-white font-bold tracking-wider shadow-lg transform hover:scale-105 transition-all duration-200"
            style={{ 
              background: `linear-gradient(to right, ${GRADIENT_START}, ${GRADIENT_END})`,
            }}>
            START YOUR FIRST GAME
          </Link>
        </div>
      </div>
      
      {/* Scoring System Section */}
      <div className="mt-16 rounded-xl shadow-lg p-8 max-w-5xl mx-auto" style={{
        background: `linear-gradient(to right, ${COLORS[3] + '10'}, ${COLORS[4] + '10'})`,
        borderLeft: `3px solid ${COLORS[3]}`,
      }}>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke={COLORS[3]}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Scoring System
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">How Winning Scores Work</h3>
            <p className="text-gray-700 mb-4">Your score is calculated based on time taken, difficulty level, and flag efficiency.</p>
            <ul className="space-y-3">
              {[
                "Beginner games start at 100 base points",
                "Intermediate games start at 250 base points",
                "Expert games start at 400 base points",
                "Faster completion times earn higher scores",
                "Efficient flag usage gives up to 30% bonus points"
              ].map((rule, index) => (
                <li key={index} className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">{rule}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
              <p className="text-sm text-purple-800 font-medium">Possible score ranges:</p>
              <p className="text-sm text-purple-700">• Beginner: 30-130 points</p>
              <p className="text-sm text-purple-700">• Intermediate: 75-325 points</p>
              <p className="text-sm text-purple-700">• Expert: 120-520 points</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Consolation Scores</h3>
            <p className="text-gray-700 mb-4">Even when you hit a mine, you'll still earn points based on your progress:</p>
            <ul className="space-y-3">
              {[
                "Points are awarded based on estimated board progress",
                "Longer game time (before losing) generally means more progress",
                "Beginner: Up to 20 base consolation points",
                "Intermediate: Up to 40 base consolation points",
                "Expert: Up to 60 base consolation points"
              ].map((rule, index) => (
                <li key={index} className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-gray-700">{rule}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-800 font-medium">Strategy tip:</p>
              <p className="text-sm text-blue-700">Careful and efficient flag placement can significantly increase your score. Use your flags wisely!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;