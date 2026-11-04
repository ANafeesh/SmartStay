const express = require("express");
const { vendors } = require("../controllers/catalogController");
const { protect, authorizeRole } = require("../middleware/authMiddleware");

const router = express.Router();

// Public/student list of approved vendors
router.get("/", vendors.list);
router.get("/:id", vendors.get);

// Submit vendor registration application
router.post("/", vendors.create);

// Vendor update / remove (Vendor owner, Admin)
router.put("/:id", protect, authorizeRole("vendor", "admin"), vendors.update);
router.delete("/:id", protect, authorizeRole("admin"), vendors.remove);

module.exports = router;
