const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Public Authentication Endpoints
router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/logout", authController.logout);

// Protected Authentication Verification
router.get("/me", protect, authController.getMe);
router.put("/profile", protect, authController.updateProfile);
router.put("/change-password", protect, authController.changePassword);

module.exports = router;
