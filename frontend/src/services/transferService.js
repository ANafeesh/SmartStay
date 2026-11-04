import { API_BASE_URL, getAuthToken } from "./apiClient";

const getHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Fetch current student's active room allocation
 */
export async function getMyAllocation(studentRegId = "") {
  try {
    const query = studentRegId ? `?studentRegistrationId=${encodeURIComponent(studentRegId)}` : "";
    const res = await fetch(`${API_BASE_URL}/allocations/my-allocation${query}`, {
      headers: getHeaders(),
      credentials: "include",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to fetch active allocation");
    }
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn("getMyAllocation warning:", err.message);
    return null;
  }
}

/**
 * Fetch transfer requests for the student
 */
export async function getStudentTransfers(studentRegId = "") {
  try {
    const query = studentRegId ? `?studentRegistrationId=${encodeURIComponent(studentRegId)}` : "";
    const res = await fetch(`${API_BASE_URL}/transfers${query}`, {
      headers: getHeaders(),
      credentials: "include",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to fetch transfers");
    }
    const json = await res.json();
    return Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
  } catch (err) {
    console.warn("getStudentTransfers warning:", err.message);
    return [];
  }
}

/**
 * Submit a new room transfer request
 */
export async function submitTransferRequest(payload) {
  const res = await fetch(`${API_BASE_URL}/transfers`, {
    method: "POST",
    headers: getHeaders(),
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json.message || "Failed to submit room transfer request");
  }
  return json;
}

/**
 * Cancel a pending room transfer request
 */
export async function cancelTransferRequest(transferId) {
  const res = await fetch(`${API_BASE_URL}/transfers/${transferId}`, {
    method: "DELETE",
    headers: getHeaders(),
    credentials: "include",
  });

  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json.message || "Failed to cancel transfer request");
  }
  return json;
}

/**
 * Fetch all buildings
 */
export async function getBuildingsList() {
  try {
    const res = await fetch(`${API_BASE_URL}/buildings`, {
      headers: getHeaders(),
      credentials: "include",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
  } catch (err) {
    console.warn("getBuildingsList error:", err.message);
    return [];
  }
}

/**
 * Fetch rooms by building
 */
export async function getRoomsByBuilding(buildingId) {
  try {
    const query = buildingId ? `?buildingId=${buildingId}` : "";
    const res = await fetch(`${API_BASE_URL}/rooms${query}`, {
      headers: getHeaders(),
      credentials: "include",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
  } catch (err) {
    console.warn("getRoomsByBuilding error:", err.message);
    return [];
  }
}

/**
 * Fetch available beds by room
 */
export async function getAvailableBedsByRoom(roomId) {
  try {
    const query = `?roomId=${roomId}&status=Available`;
    const res = await fetch(`${API_BASE_URL}/beds${query}`, {
      headers: getHeaders(),
      credentials: "include",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
  } catch (err) {
    console.warn("getAvailableBedsByRoom error:", err.message);
    return [];
  }
}
