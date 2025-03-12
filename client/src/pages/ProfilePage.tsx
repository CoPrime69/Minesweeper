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
}

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

  // Filter scores by difficulty
  const filteredScores = scores.filter(score => score.difficulty === activeTab);

  // Calculate stats
  const totalGames = scores.length;
  const beginnerGames = scores.filter(score => score.difficulty === 'beginner').length;
  const intermediateGames = scores.filter(score => score.difficulty === 'intermediate').length;
  const expertGames = scores.filter(score => score.difficulty === 'expert').length;

  // Best times
  const bestBeginnerTime = scores
    .filter(score => score.difficulty === 'beginner')
    .sort((a, b) => a.time - b.time)[0]?.time;
  
  const bestIntermediateTime = scores
    .filter(score => score.difficulty === 'intermediate')
    .sort((a, b) => a.time - b.time)[0]?.time;
  
  const bestExpertTime = scores
    .filter(score => score.difficulty === 'expert')
    .sort((a, b) => a.time - b.time)[0]?.time;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 text-white p-6">
            <h1 className="text-3xl font-bold">{user?.username}'s Profile</h1>
            <p className="mt-2">{user?.email}</p>
          </div>
          
          <div className="p-6">
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
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Best Times</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-700">Beginner</h3>
                  <p className="text-2xl font-bold">
                    {bestBeginnerTime ? `${bestBeginnerTime.toFixed(1)}s` : 'N/A'}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-700">Intermediate</h3>
                  <p className="text-2xl font-bold">
                    {bestIntermediateTime ? `${bestIntermediateTime.toFixed(1)}s` : 'N/A'}
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-700">Expert</h3>
                  <p className="text-2xl font-bold">
                    {bestExpertTime ? `${bestExpertTime.toFixed(1)}s` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4">Game History</h2>
              
              <div className="mb-4">
                <div className="inline-flex rounded-md shadow-sm" role="group">
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
                <p>Loading your game history...</p>
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
