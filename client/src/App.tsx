import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, AuthContext } from './contexts/AuthContext';

// Components
import Navbar from './components/Navbar';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GamePage from './pages/GamePage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

// Define proper interface for ProtectedRoute props
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

// Protected Route Component
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = React.useContext(AuthContext);
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/play" element={<GamePage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <ToastContainer position="bottom-right" />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;