import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

// Vibrant color palette
const COLORS = ['#FF6B6B', '#4ECDC4', '#FFD166', '#6A0572', '#AB83A1'];
const GRADIENT_START = '#5533FF';
const GRADIENT_END = '#2B8EFF';

const Navbar: React.FC = () => {
  const { isAuthenticated, isAdmin, user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="text-white shadow-xl" style={{
      background: `linear-gradient(to right, ${GRADIENT_START}, ${GRADIENT_END})`,
      borderBottom: `2px solid ${COLORS[0]}`
    }}>
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-extrabold tracking-tight flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" viewBox="0 0 20 20" fill={COLORS[2]}>
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-13a1 1 0 100-2 1 1 0 000 2zm0 8a1 1 0 011 1v1h1a1 1 0 110 2h-4a1 1 0 110-2h1v-1a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 font-black">MINE</span>
          <span className="font-medium ml-1">SWEEPER</span>
        </Link>
        
        <div className="flex items-center space-x-8">
          {isAuthenticated ? (
            <>
              <div className="hidden md:flex items-center space-x-6">
                <Link 
                  to="/play" 
                  className="font-semibold text-lg hover:text-yellow-300 transition-colors duration-300"
                >
                  PLAY
                </Link>
                
                <Link 
                  to="/leaderboard" 
                  className="font-semibold text-lg hover:text-yellow-300 transition-colors duration-300"
                >
                  SCORES
                </Link>
                
                <Link 
                  to="/profile" 
                  className="font-semibold text-lg hover:text-yellow-300 transition-colors duration-300"
                >
                  PROFILE
                </Link>
              </div>
              
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="hidden md:block px-4 py-2 rounded-lg text-white font-bold uppercase tracking-wider shadow-lg transform hover:scale-105 transition-all duration-200"
                  style={{ backgroundColor: COLORS[0] }}
                >
                  Admin
                </Link>
              )}
              
              <div className="relative">
                <button 
                  className="flex items-center space-x-2 focus:outline-none py-1 px-2 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors duration-200"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-lg border-2 border-white"
                    style={{ backgroundColor: COLORS[0] }}
                  >
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{user?.username}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl py-3 z-10 border border-gray-100 transform transition-all duration-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm text-gray-500">Signed in as</p>
                      <p className="font-medium text-gray-800">{user?.username}</p>
                    </div>
                    <Link 
                      to="/profile" 
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      My Profile
                    </Link>
                    <Link 
                      to="/play" 
                      className="md:hidden flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Play Game
                    </Link>
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button 
                        onClick={logout}
                        className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-red-50 transition-colors duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="space-x-4">
                <Link 
                  to="/login" 
                  className="font-medium px-5 py-2 rounded-lg border-2 border-white hover:bg-white hover:text-blue-600 transition-colors duration-300"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="font-medium px-5 py-2 rounded-lg text-blue-700 bg-white hover:bg-yellow-300 hover:text-blue-800 transition-colors duration-300 shadow-lg"
                >
                  Register
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;