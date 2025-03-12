import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { getUsers, getAdminScores, getAdminStats, updateUserRole, deleteUser } from '../services/api';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Score {
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

interface Stats {
  totalUsers: number;
  totalGames: number;
  difficultyStats: {
    _id: string;
    count: number;
    avgTime: number;
    avgScore: number;
  }[];
  dailyActivity: {
    _id: string;
    count: number;
  }[];
}

// Vibrant color palette
const COLORS = ['#FF6B6B', '#4ECDC4', '#FFD166', '#6A0572', '#AB83A1'];
const GRADIENT_START = '#5533FF';
const GRADIENT_END = '#2B8EFF';

const AdminPage: React.FC = () => {
  const { isAdmin, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'scores'>('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/');
      return;
    }
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (activeTab === 'dashboard') {
          const statsData = await getAdminStats();
          setStats(statsData);
        } else if (activeTab === 'users') {
          const userData = await getUsers();
          setUsers(userData);
        } else if (activeTab === 'scores') {
          const scoresData = await getAdminScores();
          setScores(scoresData);
        }
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [isAuthenticated, isAdmin, navigate, activeTab]);
  
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateUserRole(userId, newRole);
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
      toast.success('User role updated successfully');
    } catch (error) {
      console.error('Failed to update user role:', error);
      toast.error('Failed to update user role');
    }
  };
  
  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      await deleteUser(userId);
      setUsers(users.filter(user => user._id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error('Failed to delete user');
    }
  };
  
  // Format data for charts
  const difficultyData = stats?.difficultyStats.map(stat => ({
    name: stat._id.charAt(0).toUpperCase() + stat._id.slice(1),
    games: stat.count,
    avgTime: parseFloat(stat.avgTime.toFixed(2)),
    avgScore: parseFloat(stat.avgScore.toFixed(0))
  })) || [];
  
  const activityData = stats?.dailyActivity.map(day => ({
    date: day._id,
    games: day.count
  })).reverse() || [];
  
  const pieData = stats?.difficultyStats.map(stat => ({
    name: stat._id.charAt(0).toUpperCase() + stat._id.slice(1),
    value: stat.count
  })) || [];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 px-4 py-8">
      <div className="container mx-auto">
        <div className="mb-8 flex items-center">
          <div 
            className="text-5xl font-extrabold mr-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500"
          >
            
            Admin Portal
          </div>
          
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-indigo-100">
          <div className="flex border-b border-indigo-100">
            <button
              className={`px-8 py-4 font-medium text-lg transition-all duration-200 ease-in-out ${
                activeTab === 'dashboard' 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white' 
                  : 'hover:bg-indigo-50 text-gray-600 hover:text-indigo-700'
              }`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`px-8 py-4 font-medium text-lg transition-all duration-200 ease-in-out ${
                activeTab === 'users' 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white' 
                  : 'hover:bg-indigo-50 text-gray-600 hover:text-indigo-700'
              }`}
              onClick={() => setActiveTab('users')}
            >
              Users
            </button>
            <button
              className={`px-8 py-4 font-medium text-lg transition-all duration-200 ease-in-out ${
                activeTab === 'scores' 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white' 
                  : 'hover:bg-indigo-50 text-gray-600 hover:text-indigo-700'
              }`}
              onClick={() => setActiveTab('scores')}
            >
              Scores
            </button>
          </div>
          
          <div className="p-8">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                <p className="ml-4 text-lg text-purple-500 font-medium">Loading...</p>
              </div>
            ) : activeTab === 'dashboard' ? (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-2xl shadow-lg transform transition-transform hover:scale-105">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-white">Total Users</h3>
                      <div className="bg-white/20 p-2 rounded-lg cursor-pointer" onClick={() => setActiveTab('users')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-4xl font-bold text-white">{stats?.totalUsers || 0}</p>
                    <p className="text-white/70 mt-2">Total registered accounts</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-6 rounded-2xl shadow-lg transform transition-transform hover:scale-105">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-white">Total Games</h3>
                      <div className="bg-white/20 p-2 rounded-lg cursor-pointer" onClick={() => setActiveTab('scores')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-4xl font-bold text-white">{stats?.totalGames || 0}</p>
                    <p className="text-white/70 mt-2">Games played all time</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-6 rounded-2xl shadow-lg transform transition-transform hover:scale-105">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-white">Games Today</h3>
                      <div className="bg-white/20 p-2 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-4xl font-bold text-white">
                      {stats?.dailyActivity[0]?._id === new Date().toISOString().split('T')[0] 
                        ? stats.dailyActivity[0].count 
                        : 0}
                    </p>
                    <p className="text-white/70 mt-2">Activity in the last 24 hours</p>
                  </div>
                </div>
                
                <div className="mb-10">
                  <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Games by Difficulty
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={difficultyData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={GRADIENT_START} stopOpacity={1} />
                              <stop offset="100%" stopColor={GRADIENT_END} stopOpacity={1} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="name" tick={{ fill: '#666' }} />
                          <YAxis tick={{ fill: '#666' }} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#fff',
                              borderRadius: '8px',
                              border: '1px solid #ddd',
                              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}
                          />
                          <Legend />
                          <Bar 
                            dataKey="games" 
                            fill="url(#barGradient)" 
                            name="Games Played" 
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#fff',
                              borderRadius: '8px',
                              border: '1px solid #ddd',
                              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Daily Activity (Last 7 Days)
                  </h3>
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={activityData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <defs>
                          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#FF6B6B" stopOpacity={1} />
                            <stop offset="100%" stopColor="#FF8E53" stopOpacity={1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" tick={{ fill: '#666' }} />
                        <YAxis tick={{ fill: '#666' }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            border: '1px solid #ddd',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                          }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="games" 
                          stroke="url(#lineGradient)" 
                          strokeWidth={3}
                          dot={{ fill: '#FF6B6B', stroke: '#FF6B6B', strokeWidth: 2, r: 6 }}
                          activeDot={{ r: 8, stroke: '#FF8E53', strokeWidth: 2 }}
                          name="Games Played" 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ) : activeTab === 'users' ? (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  User Management
                </h2>
                <div className="bg-white overflow-hidden rounded-xl shadow-md border border-indigo-100">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-purple-600 to-blue-500">
                        <tr>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Username
                          </th>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Email
                          </th>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Role
                          </th>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Joined
                          </th>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                          <tr key={user._id} className="hover:bg-indigo-50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold mr-3">
                                  {user.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="text-sm font-medium text-gray-900">{user.username}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <select
                                value={user.role}
                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-lg px-3 py-1 transition-colors duration-150"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Score History
                </h2>
                <div className="bg-white overflow-hidden rounded-xl shadow-md border border-indigo-100">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-purple-600 to-blue-500">
                        <tr>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                            User
                          </th>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Difficulty
                          </th>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Score
                          </th>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Time
                          </th>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {scores.map(score => (
                          <tr key={score._id} className="hover:bg-indigo-50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold mr-3">
                                  {score.user.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="text-sm font-medium text-gray-900">{score.user.username}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                                score.difficulty === 'easy' 
                                  ? 'bg-green-100 text-green-800' 
                                  : score.difficulty === 'medium'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                              }`}>
                                {score.difficulty.charAt(0).toUpperCase() + score.difficulty.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-bold text-gray-900">{score.score}</div>
                              <div className="text-xs text-gray-500">points</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{score.time.toFixed(1)}s</div>
                              <div className="text-xs text-gray-500">completion time</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(score.date).toLocaleDateString()} 
                              <div className="text-xs text-gray-400">
                                {new Date(score.date).toLocaleTimeString()}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;