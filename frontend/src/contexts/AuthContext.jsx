import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const defaultUser = {
    name: "Admin",
    role: "Service Manager",
    email: "admin@devicenexus.io",
    isLoggedIn: false,
  };

  const [user, setUser] = useState(defaultUser);

  const login = (userData) => {
    setUser({
      name: userData.name?.trim() || "Admin",
      role: userData.role || "Service Executive",
      email: userData.email || "user@devicenexus.io",
      isLoggedIn: true,
    });
  };

  const logout = () => {
    setUser(defaultUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
