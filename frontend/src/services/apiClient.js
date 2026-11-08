/**
 * Centralized API Client for SmartStay
 * Supports environment-aware base URL, automatic JWT Bearer header attachment,
 * cross-origin cookie credentials, and configurable fetch timeout.
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== "undefined" &&
  window.location.hostname &&
  window.location.hostname !== "localhost" &&
  window.location.hostname !== "127.0.0.1"
    ? (window.location.protocol === "https:" ? "/api" : `http://${window.location.hostname}:5000/api`)
    : "http://localhost:5000/api");

export function getAuthToken() {
  try {
    return localStorage.getItem("smartstay_token") || null;
  } catch {
    return null;
  }
}

export function setAuthToken(token) {
  try {
    if (token) {
      localStorage.setItem("smartstay_token", token);
    } else {
      localStorage.removeItem("smartstay_token");
    }
  } catch {
    // Ignore storage errors
  }
}

/**
 * Universal fetch wrapper with authentication, timeout, and error handling
 */
export async function apiFetch(endpoint, options = {}) {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const headers = {
    ...options.headers,
  };

  // Add JSON Content-Type if body is an object and not FormData
  if (
    options.body &&
    typeof options.body === "object" &&
    !(options.body instanceof FormData)
  ) {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(options.body);
  }

  // Attach JWT Bearer token if present
  const token = getAuthToken();
  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Fast AbortController timeout (default 6 seconds) to prevent frozen UI spinning
  const timeoutMs = options.timeout ?? 15000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const fetchOptions = {
    ...options,
    headers,
    credentials: options.credentials || "include",
    signal: options.signal || controller.signal,
  };

  let response;
  try {
    response = await fetch(url, fetchOptions);
  } catch (netErr) {
    clearTimeout(timeoutId);
    if (netErr.name === "AbortError") {
      throw new Error(`Request to ${endpoint} timed out after ${timeoutMs}ms.`);
    }
    throw netErr;
  } finally {
    clearTimeout(timeoutId);
  }

  // Parse JSON response
  let data;
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = { success: response.ok, message: await response.text() };
  }

  if (!response.ok) {
    let errorMsg = data?.message;
    if (response.status === 413) {
      errorMsg = "Attachment or photo payload is too large. Please select a smaller photo.";
    } else if (typeof errorMsg === "string" && errorMsg.includes("<html")) {
      const match = errorMsg.match(/<pre>([\s\S]*?)<\/pre>/i) || errorMsg.match(/<title>([\s\S]*?)<\/title>/i);
      errorMsg = match ? match[1].trim() : "Server returned an unexpected response.";
    } else if (!errorMsg) {
      errorMsg = `Request failed with HTTP status ${response.status}`;
    }
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

export default apiFetch;
