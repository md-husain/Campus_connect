import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api"; // adjust path if needed
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Will contain user info
  const [loading, setLoading] = useState(true); // Loading state during fetch
  const navigate = useNavigate();

  // Fetch user when app starts (if accessToken exists)
  useEffect(() => {
    const bootstrapAsync = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const response = await authAPI.getProfile();
          setUser(response.data.data); // user data from backend
        } catch (error) {
          console.error("Error loading profile:", error);
          localStorage.removeItem("accessToken");
        }
      }
      setLoading(false);
    };
    bootstrapAsync();
  }, []);

  // 🟢 Login function
  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { accessToken, refreshToken, ...userData } = response.data.data;

      // Save token and user data
      localStorage.setItem("accessToken", accessToken);
      setUser(userData);
      navigate("/"); // redirect to home
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  // 🟢 Register function
  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { accessToken, refreshToken, ...newUser } = response.data.data;

      // Save token and user data
      localStorage.setItem("accessToken", accessToken);
      setUser(newUser);
      navigate("/");
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  // 🔴 Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      localStorage.removeItem("accessToken");
      setUser(null);
      navigate("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use authentication
export const useAuth = () => useContext(AuthContext);
