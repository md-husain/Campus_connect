import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(undefined);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await authAPI.getProfile();
      if (response.data.data) {
        setUser(response.data.data);
        setIsAuthenticated(true);
      } else {
        throw new Error('No user data received');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('accessToken');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const normalizedCredentials = {
        ...credentials,
        email: credentials.email.trim().toLowerCase()
      };

      const response = await authAPI.login(normalizedCredentials);
      
      // response.data.data should now contain the user data object
      const userData = response.data?.data;
      
      if (userData && userData.accessToken) {
        localStorage.setItem('accessToken', userData.accessToken);
        const { accessToken, refreshToken, ...user } = userData;
        setUser(user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { 
          success: false, 
          message: response.data?.message || 'Invalid response from server' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const { confirmPassword, ...registrationData } = userData;
      const normalizedData = {
        email: (registrationData.email || '').trim().toLowerCase(),
        username: (registrationData.username || '').trim().toLowerCase(),
        fullname: (registrationData.fullname || '').trim(),
        password: registrationData.password,
        bio: (registrationData.bio || '').trim(),
        department: (registrationData.department || '').trim(),
        role: registrationData.role || 'Student'
      };

      const response = await authAPI.register(normalizedData);
      
      // response.data.data should now contain the user data object
      const responseData = response.data?.data;
      
      if (responseData && responseData.accessToken) {
        localStorage.setItem('accessToken', responseData.accessToken);
        const { accessToken, refreshToken, ...user } = responseData;
        setUser(user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { 
          success: false, 
          message: response.data?.message || 'Invalid response from server' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export both as named exports (better for Fast Refresh)
export { useAuth, AuthProvider };




