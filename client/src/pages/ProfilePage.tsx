import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { getPersonalBests } from '../services/api';
import { toast } from 'react-toastify';

interface Score {
  _id: string;
  difficulty: string;
  score: number;
  time: number;
  date: string;
  won?: boolean; // Add this field if available
}

// Score thresholds that indicate a winning game
const WIN_SCORE_THRESHOLDS = {
  beginner: 50,
  intermediate: 125,
  expert: 200
};

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'beginner' | 'intermediate' | 'expert'>('beginner');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchScores = async () => {
      try {
        setLoading(true);
        const data = await getPersonalBests();
        console.log('Fetched scores:', data); // Debug to see score structure
        setScores(data);
      } catch (error) {
        console.error('Failed to fetch scores:', error);
        toast.error('Failed to load your scores');
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [isAuthenticated, navigate]);

  // Helper function to determine if a score represents a winning game
  const isWinningGame = (score: Score): boolean => {
    // First check explicit won field if available
    if (score.won !== undefined) return score.won;
    
    // Otherwise infer from score (higher scores are winning games)
    return score.score >= WIN_SCORE_THRESHOLDS[score.difficulty as keyof typeof WIN_SCORE_THRESHOLDS];
  };

  // Filter scores by difficulty
  const filteredScores = scores.filter(score => score.difficulty === activeTab);

  // Calculate stats
  const totalGames = scores.length;
  const beginnerGames = scores.filter(score => score.difficulty === 'beginner').length;
  const intermediateGames = scores.filter(score => score.difficulty === 'intermediate').length;
  const expertGames = scores.filter(score => score.difficulty === 'expert').length;

  // Best times - ONLY use winning games
  const winningBeginnerScores = scores.filter(
    score => score.difficulty === 'beginner' && isWinningGame(score)
  );
  
  const winningIntermediateScores = scores.filter(
    score => score.difficulty === 'intermediate' && isWinningGame(score)
  );
  
  const winningExpertScores = scores.filter(
    score => score.difficulty === 'expert' && isWinningGame(score)
  );
  
  // Get best times from winning scores
  const bestBeginnerTime = winningBeginnerScores.length > 0
    ? winningBeginnerScores.sort((a, b) => a.time - b.time)[0].time
    : null;
  
  const bestIntermediateTime = winningIntermediateScores.length > 0
    ? winningIntermediateScores.sort((a, b) => a.time - b.time)[0].time
    : null;
  
  const bestExpertTime = winningExpertScores.length > 0
    ? winningExpertScores.sort((a, b) => a.time - b.time)[0].time
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <h1 className="text-3xl font-bold">{user?.username}'s Profile</h1>
            <p className="mt-2">{user?.email}</p>
          </div>
          
          <div className="p-6">
            {/* Stats section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-600">{totalGames}</div>
                <div className="text-gray-500">Total Games</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-600">{beginnerGames}</div>
                <div className="text-gray-500">Beginner Games</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-yellow-600">{intermediateGames}</div>
                <div className="text-gray-500">Intermediate Games</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-red-600">{expertGames}</div>
                <div className="text-gray-500">Expert Games</div>
              </div>
            </div>
            
            {/* Best Times section with win indicator */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">
                Best Times <span className="text-sm font-normal text-gray-500">(Winning Games Only)</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-700">Beginner</h3>
                  <p className="text-2xl font-bold">
                    {bestBeginnerTime ? `${bestBeginnerTime.toFixed(1)}s` : 'No wins yet'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {winningBeginnerScores.length} winning games
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-700">Intermediate</h3>
                  <p className="text-2xl font-bold">
                    {bestIntermediateTime ? `${bestIntermediateTime.toFixed(1)}s` : 'No wins yet'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {winningIntermediateScores.length} winning games
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-700">Expert</h3>
                  <p className="text-2xl font-bold">
                    {bestExpertTime ? `${bestExpertTime.toFixed(1)}s` : 'No wins yet'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {winningExpertScores.length} winning games
                  </p>
                </div>
              </div>
            </div>
            
            {/* Game history tabs */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Game History</h2>
              
              <div className="mb-4">
                <div className="inline-flex rounded-md shadow-sm" role="group">
                  {/* Tab buttons - unchanged */}
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                      activeTab === 'beginner'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('beginner')}
                  >
                    Beginner
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === 'intermediate'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('intermediate')}
                  >
                    Intermediate
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                      activeTab === 'expert'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('expert')}
                  >
                    Expert
                  </button>
                </div>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredScores.length === 0 ? (
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p>No games played at this difficulty level yet.</p>
                  <button
                    onClick={() => navigate('/play')}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Play Now
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Score
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Result
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredScores.map((score, index) => (
                        <tr key={score._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(score.date).toLocaleDateString()} {new Date(score.date).toLocaleTimeString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {score.score}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {score.time.toFixed(1)}s
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {isWinningGame(score) ? (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                Won
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                Lost
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;