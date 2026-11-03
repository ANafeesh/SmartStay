import { apiFetch, setAuthToken } from "./apiClient";

/**
 * Authenticate against backend /api/auth/login
 */
export async function loginUser(credentials) {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: credentials,
  });

  if (data?.token) {
    setAuthToken(data.token);
  }

  return data;
}

/**
 * Register account via /api/auth/register
 */
export async function registerUser(userData) {
  const data = await apiFetch("/auth/register", {
    method: "POST",
    body: userData,
  });

  if (data?.token) {
    setAuthToken(data.token);
  }

  return data;
}

/**
 * Verify active session via /api/auth/me
 */
export async function getCurrentUser() {
  return await apiFetch("/auth/me", {
    method: "GET",
  });
}

/**
 * Update authenticated user profile via /api/auth/profile
 */
export async function updateUserProfile(profileData) {
  return await apiFetch("/auth/profile", {
    method: "PUT",
    body: profileData,
  });
}

/**
 * Terminate session via /api/auth/logout
 */
export async function logoutUser() {
  try {
    await apiFetch("/auth/logout", {
      method: "POST",
    });
  } catch (err) {
    console.warn("Backend logout notification warning:", err.message);
  } finally {
    setAuthToken(null);
  }
}
