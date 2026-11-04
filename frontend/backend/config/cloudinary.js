const cloudinary = require("cloudinary").v2;

const isConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log("Cloudinary initialized with Cloud:", process.env.CLOUDINARY_CLOUD_NAME);
} else {
  console.warn("Cloudinary credentials not detected in .env. Uploads will use inline data fallback until credentials are set.");
}

/**
 * Uploads a file buffer to Cloudinary
 * @param {Buffer} buffer - File buffer
 * @param {string} folder - Destination folder in Cloudinary
 * @param {string} originalName - Original filename
 * @returns {Promise<{ url: string, publicId: string, name: string }>}
 */
const uploadBufferToCloudinary = (buffer, folder = "smartstay/complaints", originalName = "photo.jpg") => {
  return new Promise((resolve, reject) => {
    if (!isConfigured) {
      // Fallback if user has not yet populated their Cloudinary keys in .env
      const base64 = buffer.toString("base64");
      const mime = originalName.endsWith(".png") ? "image/png" : originalName.endsWith(".webp") ? "image/webp" : "image/jpeg";
      const dataUri = `data:${mime};base64,${base64}`;
      return resolve({
        url: dataUri,
        publicId: `fallback_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        name: originalName,
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          name: originalName,
        });
      }
    );

    uploadStream.end(buffer);
  });
};

module.exports = {
  cloudinary,
  isConfigured,
  uploadBufferToCloudinary,
};
