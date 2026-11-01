const express = require("express");
const { deliverySlots } = require("../controllers/catalogController");
const { protect, authorizeRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", deliverySlots.list);
router.get("/:id", deliverySlots.get);

router.post("/", protect, authorizeRole("vendor", "admin"), deliverySlots.create);
router.put("/:id", protect, authorizeRole("vendor", "admin"), deliverySlots.update);
router.delete("/:id", protect, authorizeRole("vendor", "admin"), deliverySlots.remove);

module.exports = router;
