import { apiFetch } from "./apiClient";

// In-memory response cache with TTL to eliminate re-fetching latency across tab switches
const apiCache = new Map();
const CACHE_TTL_MS = 60000; // 60 seconds

/**
 * Reusable JSON fetch utility with centralized authentication and intelligent caching
 */
async function fetchJSON(endpoint, options = {}, useCache = true) {
  const isGet = !options.method || options.method.toUpperCase() === "GET";
  const cacheKey = isGet ? endpoint : null;

  if (useCache && isGet && apiCache.has(cacheKey)) {
    const cached = apiCache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
  }

  const result = await apiFetch(endpoint, options);

  if (useCache && isGet && result) {
    apiCache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
    });
  }

  return result;
}

export function clearAnalyticsCache() {
  apiCache.clear();
}

/**
 * MODULE 5: PRESERVED ENDPOINTS
 */

// GET /api/analytics/summary
export function getMonitoringSummary() {
  return fetchJSON("/analytics/summary");
}

// GET /api/analytics/blocks
export function getBlockSummary() {
  return fetchJSON("/analytics/blocks");
}

// GET /api/monitoring
export function getMonitoringReadings(utilityType) {
  const query = utilityType
    ? `?utilityType=${encodeURIComponent(utilityType)}`
    : "";

  return fetchJSON(`/monitoring${query}`);
}

// GET /api/monitoring/latest
export function getLatestMonitoringReadings() {
  return fetchJSON("/monitoring/latest");
}

// POST /api/monitoring
export function createMonitoringReading(readingData) {
  clearAnalyticsCache();
  return fetchJSON("/monitoring", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(readingData),
  }, false);
}

/**
 * MODULE 5: ANALYTICS ENDPOINTS
 */

// GET /api/analytics/occupancy
export function getOccupancyAnalytics() {
  return fetchJSON("/analytics/occupancy");
}

// GET /api/analytics/financial
export function getFinancialAnalytics() {
  return fetchJSON("/analytics/financial");
}

// GET /api/analytics/complaints
export function getComplaintAnalytics() {
  return fetchJSON("/analytics/complaints");
}

// GET /api/analytics/telemetry-trend
export function getTelemetryTrend(params = {}) {
  const searchParams = new URLSearchParams();
  if (params.utilityType && params.utilityType !== "All") {
    searchParams.append("utilityType", params.utilityType);
  }
  if (params.period && params.period !== "all") {
    searchParams.append("period", params.period);
  }
  if (params.blockName && params.blockName !== "All") {
    searchParams.append("blockName", params.blockName);
  }

  const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
  return fetchJSON(`/analytics/telemetry-trend${query}`);
}

// GET /api/analytics/alerts
export function getMonitoringAlerts() {
  return fetchJSON("/analytics/alerts");
}

// GET /api/analytics/food-orders
export function getFoodOrderAnalytics() {
  return fetchJSON("/analytics/food-orders");
}

// GET /api/food-orders (Module 2 Food Orders list)
export function getFoodOrders(params = {}) {
  const searchParams = new URLSearchParams();
  if (params.status && params.status !== "All") {
    searchParams.append("status", params.status);
  }
  const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
  return fetchJSON(`/food-orders${query}`);
}

// GET /api/payment-notifications (Module 3 Payment Notifications - requires recipientId)
export function getPaymentNotifications(recipientId = "admin") {
  const query = recipientId ? `?recipientId=${encodeURIComponent(recipientId)}` : "";
  return fetchJSON(`/payment-notifications${query}`);
}

// GET /api/complaints (Module 4 Complaints list)
export function getComplaints(params = {}) {
  return fetchJSON("/complaints");
}
