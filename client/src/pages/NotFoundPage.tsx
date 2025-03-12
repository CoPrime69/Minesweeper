import React from 'react';
import { Link } from 'react-router-dom';

// Matching color palette from Navbar
const COLORS = ['#FF6B6B', '#4ECDC4', '#FFD166', '#6A0572', '#AB83A1'];
const GRADIENT_START = '#5533FF';
const GRADIENT_END = '#2B8EFF';

const NotFoundPage: React.FC = () => {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center text-white px-4 text-center"
      style={{
        background: `linear-gradient(135deg, ${GRADIENT_START}, ${GRADIENT_END})`,
      }}
    >
      <div className="max-w-2xl w-full bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white border-opacity-20">
        <div className="mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" viewBox="0 0 20 20" fill={COLORS[2]}>
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        
        <h1 className="text-7xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
          404
        </h1>
        
        <h2 className="text-3xl font-bold mb-6">
          Page Not Found
        </h2>
        
        <p className="text-lg mb-8 text-white text-opacity-80 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link 
          to="/" 
          className="inline-block px-8 py-3 rounded-xl text-blue-700 bg-white hover:bg-yellow-300 hover:text-blue-800 transition-colors duration-300 shadow-lg font-bold transform hover:scale-105"
        >
          <div className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go back home
          </div>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;