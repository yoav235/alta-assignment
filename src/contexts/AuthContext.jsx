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
      // Mock login until backend is ready
      // const response = await apiLogin(credentials);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      const userData = {
        id: 'user-' + Date.now(),
        name: credentials.email.split('@')[0], // Use email username as name
        email: credentials.email,
        role: 'sam',
      };
      
      // Store mock token
      localStorage.setItem('authToken', 'mock-token-' + Date.now());
      
      setUser(userData);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const loginWithGoogle = async (googleResponse) => {
    try {
      // For now, mock the Google login until backend is ready
      // This would normally send the Google token to your backend
      // const response = await fetch(`${API_URL}/auth/google`, {
      //   method: 'POST',
      //   body: JSON.stringify({ token: googleResponse.credential })
      // });
      
      // Mock user data from Google response
      const userData = {
        id: 'google-' + Date.now(),
        name: googleResponse.name || 'Google User',
        email: googleResponse.email || 'user@gmail.com',
        role: 'sam',
        provider: 'google',
      };
      
      setUser(userData);
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('authToken', 'mock-google-token-' + Date.now());
      
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message || 'Google login failed' };
    }
  };

  const register = async (userData) => {
    try {
      // Mock registration until backend is ready
      // const response = await apiRegister(userData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration
      const user = {
        id: 'user-' + Date.now(),
        name: userData.name,
        email: userData.email,
        role: 'sam',
      };
      
      // Store mock token
      localStorage.setItem('authToken', 'mock-token-' + Date.now());
      
      setUser(user);
      localStorage.setItem('userData', JSON.stringify(user));
      
      return { success: true, user };
    } catch (error) {
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
    loginWithGoogle,
    register,
    logout,
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

