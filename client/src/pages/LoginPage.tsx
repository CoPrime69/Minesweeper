import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

// Import same color palette as Navbar
const COLORS = ['#FF6B6B', '#4ECDC4', '#FFD166', '#6A0572', '#AB83A1'];
const GRADIENT_START = '#5533FF';
const GRADIENT_END = '#2B8EFF';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    
    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/play');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" 
         style={{ 
           background: `linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)`,
           backgroundSize: 'cover'
         }}>
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <div className="text-3xl font-extrabold tracking-tight flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-2" viewBox="0 0 20 20" fill={COLORS[2]}>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-13a1 1 0 100-2 1 1 0 000 2zm0 8a1 1 0 011 1v1h1a1 1 0 110 2h-4a1 1 0 110-2h1v-1a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 font-black">MINE</span>
              <span className="font-medium ml-1 text-gray-800">SWEEPER</span>
            </div>
          </Link>
          
          <h2 className="mt-6 text-center text-3xl font-extrabold bg-clip-text text-transparent" 
              style={{ backgroundImage: `linear-gradient(to right, ${GRADIENT_START}, ${GRADIENT_END})` }}>
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            New player?{' '}
            <Link to="/register" className="font-bold text-transparent bg-clip-text transition-colors duration-300"
                  style={{ backgroundImage: `linear-gradient(to right, ${COLORS[0]}, ${COLORS[3]})` }}>
              Create an account
            </Link>
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-bold rounded-lg text-white shadow-lg transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300 disabled:opacity-50"
                style={{
                  background: `linear-gradient(to right, ${GRADIENT_START}, ${GRADIENT_END})`,
                }}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0110 4.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.378.203 2.397.1 2.65.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.139 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>

              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10C20 4.477 15.523 0 10 0zm.515 6c1.348 0 2.51.95 2.51 2.298 0 .85-.466 1.498-1.145 1.864.56.415 1.248 1.172 1.248 2.234 0 1.41-1.25 2.604-2.613 2.604H7.71V6h2.805zM8.693 8.01v1.532h1.723c.477 0 .8-.328.8-.766 0-.44-.323-.766-.8-.766H8.693zm0 2.514v1.726h1.145c.553 0 .957-.328.957-.85 0-.517-.404-.876-.957-.876H8.693z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;