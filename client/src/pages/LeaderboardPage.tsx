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

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Header with gradient background */}
      <div className="rounded-2xl shadow-xl mb-10 p-8 text-center text-white relative overflow-hidden" 
        style={{
          background: `linear-gradient(135deg, ${GRADIENT_START}, ${GRADIENT_END})`,
          borderBottom: `3px solid ${COLORS[0]}`
        }}>
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          {/* Background pattern */}
          <div className="absolute top-10 right-10 w-20 h-20 rounded-full" style={{ backgroundColor: COLORS[0] }}></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 rounded-full" style={{ backgroundColor: COLORS[1] }}></div>
        </div>
        
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 font-black">LEADER</span>
            <span className="font-medium">BOARD</span>
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            See how you rank against the best Minesweeper players. Can you make it to the top?
          </p>
        </div>
      </div>
      
      {/* Difficulty toggle */}
      <div className="flex justify-center mb-10">
        <div className="bg-white rounded-xl shadow-lg p-2 inline-flex" role="group">
          {['beginner', 'intermediate', 'expert'].map((diff) => (
            <button
              key={diff}
              type="button"
              className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
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
      
      {/* Leaderboard table */}
      <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-4xl mx-auto">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr style={{ background: `linear-gradient(to right, ${GRADIENT_START}20, ${GRADIENT_END}20)` }}>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Rank
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Player
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Score
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Time
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {index < 3 ? (
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white mr-2 shadow"
                            style={{ backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32' }}
                          >
                            {index + 1}
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 text-gray-700 mr-2">
                            {index + 1}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white mr-2 shadow-sm"
                          style={{ backgroundColor: getDifficultyColor(difficulty) }}
                        >
                          {score.user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-sm font-medium text-gray-900">{score.user.username}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold" style={{ color: getDifficultyColor(difficulty) }}>
                      {score.score.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatTime(score.time)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(score.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Information cards */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div className="rounded-xl shadow-lg overflow-hidden">
          <div className="h-2" style={{ backgroundColor: COLORS[0] }}></div>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke={COLORS[0]}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              How Scoring Works
            </h2>
            <p className="text-gray-700">
              Scores are calculated based on difficulty level, completion time, and remaining mines.
              The faster you complete a board, the higher your score will be. Bonus points are awarded
              for consecutive wins and efficiency in flagging mines.
            </p>
          </div>
        </div>
        
        <div className="rounded-xl shadow-lg overflow-hidden">
          <div className="h-2" style={{ backgroundColor: COLORS[1] }}></div>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke={COLORS[1]}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Ranking System
            </h2>
            <p className="text-gray-700">
              Rankings are updated in real-time and show the top performances for each difficulty level.
              Only your best score for each difficulty is displayed on the leaderboard. Challenge yourself
              to climb the ranks and become a Minesweeper master!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;