import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const DEFAULT_USER = {
  name: "Nafeesh",
  initials: "AN",
  email: "nafeesh@campus.edu",
  studentId: "SEU/IS/22/ICT/090",
  role: "Student account",
  room: "Block B - Room 204",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("smartstay_auth");
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_USER;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      const saved = localStorage.getItem("smartstay_logged_in");
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("smartstay_auth", JSON.stringify(user));
      localStorage.setItem("smartstay_logged_in", JSON.stringify(isLoggedIn));
    } catch {
      // ignore
    }
  }, [user, isLoggedIn]);

  const login = (newUser = DEFAULT_USER) => {
    setUser(newUser);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // Return fallback if outside provider
    return {
      user: DEFAULT_USER,
      isLoggedIn: true,
      login: () => {},
      logout: () => {},
    };
  }
  return context;
}
