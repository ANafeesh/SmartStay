const app = require("../backend/server");
const connectDB = require("../backend/config/db");

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.warn("DB connection notice in serverless handler:", err && err.message ? err.message : err);
  }
  return app(req, res);
};
