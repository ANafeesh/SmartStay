import { createContext, useContext, useState, useEffect } from "react";
import { getDemoAccount, DEMO_ACCOUNTS } from "../data/demoAccounts";

const AuthContext = createContext(null);

const DEFAULT_USER = {
  ...DEMO_ACCOUNTS[0],
  role: "Student account", // Backward-compatibility
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("smartstay_auth");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure roleKey exists
        if (!parsed.roleKey) {
          parsed.roleKey = "student";
        }
        return parsed;
      }
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
    // If newUser is a string (e.g. roleKey), lookup the full account
    if (typeof newUser === "string") {
      const account = getDemoAccount(newUser);
      setUser({ ...account, role: account.roleBadge });
    } else {
      setUser({
        roleKey: "student",
        ...newUser,
      });
    }
    setIsLoggedIn(true);
  };

  const switchRole = (roleKey) => {
    const account = getDemoAccount(roleKey);
    const enrichedUser = {
      ...account,
      role: account.roleBadge,
    };
    setUser(enrichedUser);
    setIsLoggedIn(true);
    return enrichedUser;
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        login,
        logout,
        switchRole,
        availableRoles: DEMO_ACCOUNTS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: DEFAULT_USER,
      isLoggedIn: true,
      login: () => {},
      logout: () => {},
      switchRole: () => DEFAULT_USER,
      availableRoles: DEMO_ACCOUNTS,
    };
  }
  return context;
}
