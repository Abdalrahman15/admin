import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../authAPI';
import { useNavigate } from 'react-router-dom';

// Create auth context
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Initialize user on page load
  useEffect(() => {
    const user = authAPI.getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  // Register a new user
  const register = async (userData) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await authAPI.register(userData);
      setCurrentUser({
        id: response.userId,
        username: response.username,
        isPremium: response.isPremium
      });
      navigate('/dashboard');
      return response;
    } catch (err) {
      setError(err.toString());
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Log in an existing user
  const login = async (credentials) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await authAPI.login(credentials);
      setCurrentUser({
        id: response.userId,
        username: response.username,
        isPremium: response.isPremium
      });
      navigate('/dashboard');
      return response;
    } catch (err) {
      setError(err.toString());
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Log out the current user
  const logout = () => {
    authAPI.logout();
    setCurrentUser(null);
    navigate('/login');
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return authAPI.isAuthenticated() && currentUser !== null;
  };

  // Context value
  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;