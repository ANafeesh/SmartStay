const express = require("express");
const { menuItems } = require("../controllers/catalogController");
const { protect, authorizeRole } = require("../middleware/authMiddleware");

const router = express.Router();

// Read menus (Available to all students and authenticated users)
router.get("/", menuItems.list);
router.get("/:id", menuItems.get);

// Vendor & Admin menu mutations
router.post("/", protect, authorizeRole("vendor", "admin"), menuItems.create);
router.put("/:id", protect, authorizeRole("vendor", "admin"), menuItems.update);
router.delete("/:id", protect, authorizeRole("vendor", "admin"), menuItems.remove);

module.exports = router;
