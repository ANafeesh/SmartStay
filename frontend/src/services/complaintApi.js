const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

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

  const response = await fetch(`${API_BASE_URL}/complaints/upload`, {
    method: "POST",
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
  const response = await fetch(`${API_BASE_URL}/complaints`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(complaintData),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to submit complaint to database.");
  }

  return data.data;
}

/**
 * Fetch complaints from MongoDB
 * @param {object} [params] - Optional query parameters
 * @returns {Promise<object[]>} List of complaints
 */
export async function getComplaintsFromDB(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/complaints${query ? `?${query}` : ""}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to retrieve complaints.");
  }

  return data.data;
}
