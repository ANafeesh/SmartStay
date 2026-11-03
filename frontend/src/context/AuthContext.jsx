import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getDemoAccount, DEMO_ACCOUNTS } from "../data/demoAccounts";
import {
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser,
  updateUserProfile,
} from "../services/authApi";
import { getAuthToken, setAuthToken } from "../services/apiClient";

const AuthContext = createContext(null);

/**
 * Standardize role strings across system variations
 */
export const normalizeRole = (role) => {
  if (!role) return "student";
  const r = String(role).toLowerCase().trim();
  if (r === "hostel_admin" || r === "administrator") return "admin";
  if (r === "security_officer") return "security";
  if (r === "maintenance_staff") return "maintenance";
  if (r === "finance_staff") return "finance";
  if (r === "delivery_person") return "delivery";
  return r;
};

/**
 * Maps role key to user-facing badge label
 */
export const getRoleBadge = (role) => {
  const norm = normalizeRole(role);
  const map = {
    student: "Student Account",
    admin: "Hostel Administrator",
    warden: "Administrative Authority",
    maintenance: "Technical Staff",
    vendor: "Approved Vendor",
    finance: "Finance Officer",
    security: "Security Officer",
    delivery: "Delivery Associate",
    executive: "Executive Oversight",
  };
  return map[norm] || "Authenticated User";
};

/**
 * Enrich backend user record with frontend presentation helpers
 */
const enrichUser = (backendUser) => {
  if (!backendUser) return null;
  const roleKey = normalizeRole(backendUser.role || backendUser.roleKey);

  const demoFallback = getDemoAccount(roleKey);

  return {
    ...demoFallback,
    ...backendUser,
    roleKey,
    role: backendUser.role || roleKey,
    roleBadge: getRoleBadge(backendUser.role || roleKey),

    initials:
      backendUser.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase() || "SU",
    studentId:
      backendUser.studentId ||
      backendUser.registrationNumber ||
      demoFallback?.studentId ||
      "",
  };
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("smartstay_user");
      const token = getAuthToken();
      if (token && savedUser) {
        return enrichUser(JSON.parse(savedUser));
      }
    } catch {
      // Ignore cache parse error
    }
    return null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!getAuthToken() && !!user;
  });

  const [isLoading, setIsLoading] = useState(true);

  // Validate session against backend /api/auth/me on app launch
  const verifySession = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setIsLoggedIn(false);
      setIsLoading(false);
      return;
    }

    // Support offline or demo tokens smoothly across navigations
    if (token.startsWith("demo-token-")) {
      const savedUser = localStorage.getItem("smartstay_user");
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          const enriched = enrichUser(parsed);
          setUser(enriched);
          setIsLoggedIn(true);
        } catch {
          // ignore cache error
        }
      }
      setIsLoading(false);
      return;
    }


    try {
      const response = await getCurrentUser();
      if (response?.success && response.user) {
        const enriched = enrichUser(response.user);
        setUser(enriched);
        setIsLoggedIn(true);
        localStorage.setItem("smartstay_user", JSON.stringify(response.user));
      } else {
        throw new Error("Invalid session response");
      }
    } catch (err) {
      console.warn("Session check fallback:", err.message);
      // Fallback for development if backend is temporarily unreachable
      const savedUser = localStorage.getItem("smartstay_user");
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          const enriched = enrichUser(parsed);
          setUser(enriched);
          setIsLoggedIn(true);
        } catch {
          setAuthToken(null);
          localStorage.removeItem("smartstay_user");
          setUser(null);
          setIsLoggedIn(false);
        }
      } else {
        setAuthToken(null);
        localStorage.removeItem("smartstay_user");
        setUser(null);
        setIsLoggedIn(false);
      }

    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    verifySession();
  }, [verifySession]);

  /**
   * Real backend login
   */
  const login = async (credentials) => {
    // If credentials is a string roleKey (for testing/demo quick-fill), map it to demo account
    if (typeof credentials === "string") {
      const account = getDemoAccount(credentials);
      // Try logging in with demo account credentials against backend
      try {
        const response = await loginUser({
          identifier: account.email,
          password: account.demoPassword,
        });
        const enriched = enrichUser(response.user);
        setUser(enriched);
        setIsLoggedIn(true);
        localStorage.setItem("smartstay_user", JSON.stringify(response.user));
        return enriched;
      } catch (err) {
        // Fallback for dev testing if user not in DB yet
        console.warn("Backend login fallback for quick-fill persona:", err.message);
        const enriched = enrichUser(account);
        setUser(enriched);
        setIsLoggedIn(true);
        setAuthToken("demo-token-" + (account?.roleKey || credentials));
        localStorage.setItem("smartstay_user", JSON.stringify(account));

        return enriched;
      }
    }

    // Real object credentials { identifier, password }
    const response = await loginUser(credentials);
    if (!response?.success) {
      throw new Error(response?.message || "Login failed");
    }

    const enriched = enrichUser(response.user);
    setUser(enriched);
    setIsLoggedIn(true);
    localStorage.setItem("smartstay_user", JSON.stringify(response.user));
    return enriched;
  };

  /**
   * Real backend registration
   */
  const register = async (userData) => {
    const response = await registerUser(userData);
    if (!response?.success) {
      throw new Error(response?.message || "Registration failed");
    }

    const enriched = enrichUser(response.user);
    setUser(enriched);
    setIsLoggedIn(true);
    localStorage.setItem("smartstay_user", JSON.stringify(response.user));
    return enriched;
  };

  /**
   * Developer role switch helper (for evaluation testing)
   */
  const switchRole = (roleKey) => {
    const account = getDemoAccount(roleKey);
    const enriched = enrichUser(account);
    setUser(enriched);
    setIsLoggedIn(true);
    setAuthToken("demo-token-" + (account?.roleKey || roleKey));
    localStorage.setItem("smartstay_user", JSON.stringify(account));

    return enriched;
  };

  /**
   * Real backend logout
   */
  /**
   * Real backend & state user profile update
   */
  const updateUser = async (profileData) => {
    let backendResult = null;
    try {
      backendResult = await updateUserProfile(profileData);
    } catch (err) {
      console.warn("Backend profile update fallback:", err.message);
    }

    const updatedUser = {
      ...(user || {}),
      ...(backendResult?.user || {}),
      ...profileData,
    };

    const enriched = enrichUser(updatedUser);
    setUser(enriched);
    localStorage.setItem("smartstay_user", JSON.stringify(enriched));
    localStorage.setItem("smartstay_student_profile", JSON.stringify(profileData));
    window.dispatchEvent(new CustomEvent("smartstay-profile-updated", { detail: enriched }));
    return enriched;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.warn("Logout error:", err.message);
    } finally {
      setAuthToken(null);
      localStorage.removeItem("smartstay_user");
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        switchRole,
        availableRoles: DEMO_ACCOUNTS,
        verifySession,
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
      user: null,
      isLoggedIn: false,
      isLoading: false,
      login: async () => {},
      register: async () => {},
      logout: async () => {},
      updateUser: async () => {},
      switchRole: () => null,
      availableRoles: DEMO_ACCOUNTS,
      verifySession: async () => {},
    };
  }
  return context;
}
