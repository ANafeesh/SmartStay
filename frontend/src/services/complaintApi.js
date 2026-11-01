import { apiFetch, API_BASE_URL, getAuthToken } from "./apiClient";

/**
 * Upload photos to Cloudinary via backend API
 * @param {File[]} files - Array of image files to upload
 * @returns {Promise<{ url: string, publicId: string, name: string }[]>}
 */
export async function uploadComplaintPhotos(files) {
  if (!files || files.length === 0) return [];

  const formData = new FormData();
  for (const file of files) {
    formData.append("photos", file);
  }

  const token = getAuthToken();
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/complaints/upload`, {
    method: "POST",
    headers,
    credentials: "include",
    body: formData,
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to upload photo to Cloudinary.");
  }

  return data.data; // array of { url, publicId, name }
}

/**
 * Submit a complaint to MongoDB
 * @param {object} complaintData - Complaint form data
 * @returns {Promise<object>} Created complaint record
 */
export async function submitComplaintToDB(complaintData) {
  const data = await apiFetch("/complaints", {
    method: "POST",
    body: complaintData,
  });

  return data.data;
}

/**
 * Fetch complaints from MongoDB
 * @param {object} [params] - Optional query parameters
 * @returns {Promise<object[]>} List of complaints
 */
export async function getComplaintsFromDB(params = {}) {
  const query = new URLSearchParams(params).toString();
  const endpoint = `/complaints${query ? `?${query}` : ""}`;

  const data = await apiFetch(endpoint);
  return data.data;
}
