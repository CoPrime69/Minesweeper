import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../services/api';
import { toast } from 'react-toastify';

// Reuse the same color palette from Navbar for consistency
const COLORS = ['#FF6B6B', '#4ECDC4', '#FFD166', '#6A0572', '#AB83A1'];
const GRADIENT_START = '#5533FF';
const GRADIENT_END = '#2B8EFF';

interface LeaderboardScore {
  _id: string;
  user: {
    _id: string;
    username: string;
  };
  difficulty: string;
  score: number;
  time: number;
  date: string;
}

const LeaderboardPage: React.FC = () => {
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'expert'>('beginner');
  const [scores, setScores] = useState<LeaderboardScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await getLeaderboard(difficulty);
        setScores(data);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        toast.error('Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [difficulty]);

  // Get color for difficulty
  const getDifficultyColor = (diff: string): string => {
    switch(diff) {
      case 'beginner': return COLORS[0];
      case 'intermediate': return COLORS[1];
      case 'expert': return COLORS[2];
      default: return COLORS[0];
    }
  };

  // Format time from seconds to minutes:seconds
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(1);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  // Format date for different screen sizes
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      // Very short format for mobile table view (e.g., "12 Jan")
      veryShort: date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
      // Short format for mobile card view (e.g., "12 Jan")
      short: date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
      // Full format for desktop (e.g., "12 Jan 2025")
      full: date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
    };
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header with gradient background */}
      <div className="rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl mb-6 sm:mb-10 p-5 sm:p-8 text-center text-white relative overflow-hidden" 
        style={{
          background: `linear-gradient(135deg, ${GRADIENT_START}, ${GRADIENT_END})`,
          borderBottom: `3px solid ${COLORS[0]}`
        }}>
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          {/* Background pattern */}
          <div className="absolute top-10 right-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full" style={{ backgroundColor: COLORS[0] }}></div>
          <div className="absolute bottom-10 left-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full" style={{ backgroundColor: COLORS[1] }}></div>
        </div>
        
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-4 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 font-black">LEADER</span>
            <span className="font-medium">BOARD</span>
          </h1>
          <p className="text-base sm:text-lg opacity-90 max-w-2xl mx-auto">
            See how you rank against the best Minesweeper players.
          </p>
        </div>
      </div>
      
      {/* Difficulty toggle */}
      <div className="flex justify-center mb-6 sm:mb-10">
        <div className="bg-white rounded-xl shadow-md sm:shadow-lg p-1 sm:p-2 inline-flex w-full max-w-sm sm:w-auto" role="group">
          {['beginner', 'intermediate', 'expert'].map((diff) => (
            <button
              key={diff}
              type="button"
              className={`px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 flex-1 ${
                difficulty === diff
                  ? 'text-white shadow-md transform scale-105'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              style={{
                backgroundColor: difficulty === diff ? getDifficultyColor(diff) : 'transparent'
              }}
              onClick={() => setDifficulty(diff as 'beginner' | 'intermediate' | 'expert')}
            >
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Scrollable table for all screen sizes */}
      <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-4xl mx-auto">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr style={{ background: `linear-gradient(to right, ${GRADIENT_START}20, ${GRADIENT_END}20)` }}>
                <th scope="col" className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Rank
                </th>
                <th scope="col" className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Player
                </th>
                <th scope="col" className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Score
                </th>
                <th scope="col" className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Time
                </th>
                <th scope="col" className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Loading scores...</span>
                    </div>
                  </td>
                </tr>
              ) : scores.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No scores yet for this difficulty level
                  </td>
                </tr>
              ) : (
                scores.map((score, index) => (
                  <tr 
                    key={score._id} 
                    className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {index < 3 ? (
                          <div 
                            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white mr-2 shadow text-xs sm:text-sm"
                            style={{ backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32' }}
                          >
                            {index + 1}
                          </div>
                        ) : (
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-gray-200 text-gray-700 mr-2 text-xs sm:text-sm">
                            {index + 1}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white mr-2 shadow-sm text-xs sm:text-sm"
                          style={{ backgroundColor: getDifficultyColor(difficulty) }}
                        >
                          {score.user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-16 sm:max-w-none">
                          {score.user.username}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-semibold" style={{ color: getDifficultyColor(difficulty) }}>
                      {score.score.toLocaleString()}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                      {formatTime(score.time)}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                      <span className="hidden sm:inline">{formatDate(score.date).full}</span>
                      <span className="sm:hidden">{formatDate(score.date).veryShort}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Information cards */}
      <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
        <div className="rounded-xl shadow-md sm:shadow-lg overflow-hidden">
          <div className="h-1 sm:h-2" style={{ backgroundColor: COLORS[0] }}></div>
          <div className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke={COLORS[0]}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              How Scoring Works
            </h2>
            <p className="text-sm sm:text-base text-gray-700">
              Scores are calculated based on difficulty, completion time, and remaining mines.
              The faster you complete a board, the higher your score. Bonus points for consecutive wins.
            </p>
          </div>
        </div>
        
        <div className="rounded-xl shadow-md sm:shadow-lg overflow-hidden">
          <div className="h-1 sm:h-2" style={{ backgroundColor: COLORS[1] }}></div>
          <div className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke={COLORS[1]}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Ranking System
            </h2>
            <p className="text-sm sm:text-base text-gray-700">
              Rankings update in real-time and show top performances. Only your best score
              for each difficulty appears on the leaderboard. Can you become a Minesweeper master?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;