import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, isAuthenticated } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on mount
    const checkAuth = () => {
      if (isAuthenticated()) {
        // Get user data from localStorage if available
        const userData = localStorage.getItem('userData');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      console.log('🔐 Attempting login with:', { email: credentials.email });
      
      const response = await apiLogin(credentials);
      
      console.log('✅ Login successful! Response:', response);
      
      // Store user data
      const userData = {
        id: response.user?.id || response.id,
        name: response.user?.name || credentials.email.split('@')[0],
        email: response.user?.email || credentials.email,
        role: response.user?.role || 'sam',
      };
      
      console.log('👤 User data stored:', userData);
      
      setUser(userData);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('❌ Login failed:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const handleOAuthCallback = (token) => {
    try {
      console.log('🔐 Processing OAuth callback with token');
      
      // Store the token
      localStorage.setItem('authToken', token);
      
      // Fetch user data from backend
      fetchCurrentUser();
      
      return { success: true };
    } catch (error) {
      console.error('❌ OAuth callback failed:', error);
      return { success: false, error: error.message || 'OAuth callback failed' };
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      console.log('👤 Fetching current user from backend');
      
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      const data = await response.json();
      console.log('✅ User data fetched:', data);

      const userData = {
        id: data.user?.id || data.id,
        name: data.user?.name || data.name,
        email: data.user?.email || data.email,
        role: data.user?.role || data.role || 'sam',
      };

      setUser(userData);
      localStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error('❌ Failed to fetch user:', error);
      // Clear invalid token
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    }
  };

  const register = async (userData) => {
    try {
      console.log('📝 Attempting registration with:', { 
        name: userData.name, 
        email: userData.email 
      });
      
      const response = await apiRegister(userData);
      
      console.log('✅ Registration successful! Response:', response);
      
      const user = {
        id: response.user?.id || response.id,
        name: response.user?.name || userData.name,
        email: response.user?.email || userData.email,
        role: response.user?.role || 'sam',
      };
      
      console.log('👤 New user data stored:', user);
      
      setUser(user);
      localStorage.setItem('userData', JSON.stringify(user));
      
      return { success: true, user };
    } catch (error) {
      console.error('❌ Registration failed:', error);
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  const logout = () => {
    apiLogout();
    setUser(null);
    localStorage.removeItem('userData');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    handleOAuthCallback,
    fetchCurrentUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

