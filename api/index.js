import app from "../backend/server.js";
import connectDB from "../backend/config/db.js";

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.warn("DB connection notice in serverless handler:", err.message);
  }
  return app(req, res);
}
