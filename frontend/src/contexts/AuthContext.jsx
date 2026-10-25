import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const DEFAULT_DEMO_USER = {
  name: "Alex Morgan",
  role: "Service Manager",
  email: "alex.morgan@devicenexus.io",
  phone: "9876543210",
  department: "Technical Operations",
  isLoggedIn: true,
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("devicenexus_user");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not load user from localStorage:", e);
    }
    return DEFAULT_DEMO_USER;
  });

  useEffect(() => {
    try {
      localStorage.setItem("devicenexus_user", JSON.stringify(user));
    } catch (e) {
      console.warn("Could not save user to localStorage:", e);
    }
  }, [user]);

  // Switch active demo persona or log in
  const login = (userData) => {
    setUser((prev) => ({
      ...prev,
      name: userData.name?.trim() || "Service Executive",
      role: userData.role || "Service Executive",
      email: userData.email?.trim() || "user@devicenexus.io",
      phone: userData.phone || prev.phone,
      department: userData.department || prev.department,
      isLoggedIn: true,
    }));
  };

  // Reset to default demo user or guest
  const logout = () => {
    setUser({
      ...DEFAULT_DEMO_USER,
      name: "Guest User",
      role: "Observer",
      email: "guest@devicenexus.io",
      isLoggedIn: false,
    });
  };

  // Reset to default admin user
  const resetDemoUser = () => {
    setUser(DEFAULT_DEMO_USER);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, resetDemoUser }}>
      {children}
    </AuthContext.Provider>
  );
};
