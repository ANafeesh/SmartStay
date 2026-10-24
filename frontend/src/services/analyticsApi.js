
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function fetchJSON(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`API request failed (${response.status})`);
  }

  return response.json();
}

export function getMonitoringSummary() {
  return fetchJSON("/analytics/summary");
}

export function getBlockSummary() {
  return fetchJSON("/analytics/blocks");
}

export function getMonitoringReadings(utilityType) {
  const query = utilityType
    ? `?utilityType=${encodeURIComponent(utilityType)}`
    : "";

  return fetchJSON(`/monitoring${query}`);
}

export function getLatestMonitoringReadings() {
  return fetchJSON("/monitoring/latest");
}
