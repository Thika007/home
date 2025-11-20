import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { authAPI } from "../../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("menuUser");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authAPI.getCurrentUser();
        if (currentUser && currentUser.role === "Customer") {
          setUser({
            id: currentUser.userId,
            email: currentUser.email,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            name: `${currentUser.firstName} ${currentUser.lastName}`,
            role: currentUser.role,
            isEmailVerified: currentUser.isEmailVerified,
          });
          localStorage.setItem("menuUser", JSON.stringify({
            id: currentUser.userId,
            email: currentUser.email,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            name: `${currentUser.firstName} ${currentUser.lastName}`,
            role: currentUser.role,
            isEmailVerified: currentUser.isEmailVerified,
          }));
        } else {
          // Not a customer or not authenticated
          setUser(null);
          localStorage.removeItem("menuUser");
        }
      } catch (error) {
        // User not authenticated
        setUser(null);
        localStorage.removeItem("menuUser");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem("menuUser", JSON.stringify(userData));
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("menuUser");
    }
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

