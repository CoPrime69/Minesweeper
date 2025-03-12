import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

// Vibrant color palette
const COLORS = ['#FF6B6B', '#4ECDC4', '#FFD166', '#6A0572', '#AB83A1'];
const GRADIENT_START = '#5533FF';
const GRADIENT_END = '#2B8EFF';

const Navbar: React.FC = () => {
  const { isAuthenticated, isAdmin, user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className={`text-white shadow-xl ${mobileMenuOpen ? 'sticky top-0' : ''} z-50`} style={{
      background: `linear-gradient(to right, ${GRADIENT_START}, ${GRADIENT_END})`,
      borderBottom: `2px solid ${COLORS[0]}`
    }}>
      <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl sm:text-2xl font-extrabold tracking-tight flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 mr-1 sm:mr-2" viewBox="0 0 20 20" fill={COLORS[2]}>
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-13a1 1 0 100-2 1 1 0 000 2zm0 8a1 1 0 011 1v1h1a1 1 0 110 2h-4a1 1 0 110-2h1v-1a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 font-black">MINE</span>
          <span className="font-medium ml-1">SWEEPER</span>
        </Link>
        
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          {isAuthenticated && (
            <div className="relative mr-3">
              <button 
                className="flex items-center focus:outline-none py-1 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors duration-200"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg border-2 border-white"
                  style={{ backgroundColor: COLORS[0] }}
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl py-3 z-10 border border-gray-100">
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
          )}
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors duration-200 focus:outline-none"
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              <div className="flex items-center space-x-6">
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
                  className="px-4 py-2 rounded-lg text-white font-bold uppercase tracking-wider shadow-lg transform hover:scale-105 transition-all duration-200"
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
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl py-3 z-10 border border-gray-100">
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
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 mt-16 bg-white shadow-lg overflow-y-auto">
          <div className="p-5 space-y-5">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/play" 
                  className="block py-3 px-4 text-lg font-semibold text-gray-800 border-b border-gray-200 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Play Game
                </Link>
                <Link 
                  to="/leaderboard" 
                  className="block py-3 px-4 text-lg font-semibold text-gray-800 border-b border-gray-200 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Leaderboard
                </Link>
                <Link 
                  to="/profile" 
                  className="block py-3 px-4 text-lg font-semibold text-gray-800 border-b border-gray-200 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Profile
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="block py-3 px-4 text-lg font-semibold text-white rounded-lg"
                    style={{ backgroundColor: COLORS[0] }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button 
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full mt-4 py-3 px-4 text-lg font-semibold text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <Link 
                  to="/login" 
                  className="block w-full py-3 text-center font-semibold text-lg text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block w-full py-3 text-center font-semibold text-lg text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;