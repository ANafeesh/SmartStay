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
    warden: "Hostel Warden",
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
 * Determine if an account is a built-in demo persona
 */
export const isDemoUser = (user) => {
  if (!user) return false;
  if (user.isDemo) return true;
  const token = getAuthToken();
  if (token && token.startsWith("demo-token-")) return true;
  const email = (user.email || "").toLowerCase().trim();
  const username = (user.username || "").toLowerCase().trim();
  return (
    email === "student@smartstay.com" ||
    email === "warden@smartstay.com" ||
    email === "vendor@smartstay.com" ||
    email === "maintenance@smartstay.com" ||
    email === "executive@smartstay.com" ||
    email === "warden@campus.edu" ||
    email === "maintenance@campus.edu" ||
    email === "vendor@campusbites.edu" ||
    email === "executive@campus.edu" ||
    username === "student" ||
    username === "warden_perera" ||
    username === "tech_wickrama" ||
    username === "campus_bites" ||
    username === "dean_razak"
  );
};

/**
 * Enrich backend user record with frontend presentation helpers.
 * Built-in demo accounts get demo persona defaults; newly registered/fresh
 * accounts remain clean and isolate their own data.
 */
export const enrichUser = (backendUser, isExplicitDemo = false) => {
  if (!backendUser) return null;
  const roleKey = normalizeRole(backendUser.role || backendUser.roleKey);
  const isDemo = isExplicitDemo || backendUser.isDemo || isDemoUser(backendUser);

  // ONLY load demo presets if the user is an explicit demo persona! Fresh registered accounts are 100% clean.
  const demoFallback = isDemo ? getDemoAccount(roleKey) : null;
  const name = backendUser.name || (isDemo ? demoFallback?.name : "User") || "User";

  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || (isDemo ? "SA" : "U");

  if (!isDemo) {
    return {
      ...backendUser,
      isDemo: false,
      name,
      roleKey,
      role: backendUser.role || roleKey,
      roleBadge: getRoleBadge(backendUser.role || roleKey),
      initials,
      studentId: backendUser.studentId || backendUser.registrationNumber || "",
      registrationNumber: backendUser.registrationNumber || backendUser.studentId || "",
      phone: backendUser.phone || "",
      room: backendUser.room || "",
      building: backendUser.building || "",
      faculty: backendUser.faculty || "",
      department: backendUser.department || "",
    };
  }

  return {
    ...(demoFallback || {}),
    ...backendUser,
    isDemo: true,
    name,
    roleKey,
    role: backendUser.role || roleKey,
    roleBadge: getRoleBadge(backendUser.role || roleKey),
    initials,
    studentId:
      backendUser.studentId ||
      backendUser.registrationNumber ||
      demoFallback?.studentId ||
      "",
    registrationNumber:
      backendUser.registrationNumber ||
      backendUser.studentId ||
      "",
    phone: backendUser.phone || demoFallback?.phone || "",
    room: backendUser.room || demoFallback?.room || "",
    building: backendUser.building || demoFallback?.building || "",
    faculty: backendUser.faculty || demoFallback?.faculty || "",
    department: backendUser.department || demoFallback?.department || "",
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
          const enriched = enrichUser(parsed, true);
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
      try {
        const response = await loginUser({
          identifier: account.email,
          password: account.demoPassword,
        });
        const enriched = enrichUser({ ...response.user, isDemo: true }, true);
        setUser(enriched);
        setIsLoggedIn(true);
        localStorage.setItem("smartstay_user", JSON.stringify(enriched));
        return enriched;
      } catch (err) {
        console.warn("Backend login fallback for quick-fill persona:", err.message);
        const enriched = enrichUser({ ...account, isDemo: true }, true);
        setUser(enriched);
        setIsLoggedIn(true);
        setAuthToken("demo-token-" + (account?.roleKey || credentials));
        localStorage.setItem("smartstay_user", JSON.stringify(enriched));
        return enriched;
      }
    }

    // Real credentials { identifier, password }
    try {
      const response = await loginUser(credentials);
      if (!response?.success) {
        throw new Error(response?.message || "Login failed");
      }

      const enriched = enrichUser(response.user);
      setUser(enriched);
      setIsLoggedIn(true);
      localStorage.setItem("smartstay_user", JSON.stringify(response.user));
      return enriched;
    } catch (err) {
      // Strict: Always throw error from backend so invalid / old passwords fail properly!
      throw err;
    }
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
    const enriched = enrichUser({ ...account, isDemo: true }, true);
    setUser(enriched);
    setIsLoggedIn(true);
    setAuthToken("demo-token-" + (account?.roleKey || roleKey));
    localStorage.setItem("smartstay_user", JSON.stringify(enriched));
    return enriched;
  };

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

    const userKey = enriched._id || enriched.id || enriched.email;
    if (userKey) {
      localStorage.setItem(`smartstay_student_profile_${userKey}`, JSON.stringify(profileData));
    }

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
      // Clean legacy un-scoped cache if present
      localStorage.removeItem("smartstay_student_profile");
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
