import axios from 'axios';

// Score related API calls
export const saveScore = async (scoreData: {
  difficulty: string;
  time: number;
  score: number;
}) => {
  const response = await axios.post('/scores', scoreData);
  return response.data;
};


export const getPersonalBests = async () => {
  const response = await axios.get('/scores/personal-best');
  return response.data.data;
};

export const getLeaderboard = async (difficulty: string) => {
  const response = await axios.get(`/scores/leaderboard/${difficulty}`);
  return response.data.data;
};

// Admin API calls
export const getUsers = async () => {
  const response = await axios.get('/admin/users');
  return response.data.data;
};

export const getUserDetails = async (userId: string) => {
  const response = await axios.get(`/admin/users/${userId}`);
  return response.data.data;
};

export const updateUserRole = async (userId: string, role: string) => {
  const response = await axios.put(`/admin/users/${userId}/role`, { role });
  return response.data.data;
};

export const deleteUser = async (userId: string) => {
  const response = await axios.delete(`/admin/users/${userId}`);
  return response.data;
};

export const getAdminScores = async () => {
  const response = await axios.get('/admin/scores');
  return response.data.data;
};

export const getAdminStats = async () => {
  const response = await axios.get('/admin/stats');
  return response.data.data;
};
