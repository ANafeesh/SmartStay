const express = require("express");
const { deliverySlots } = require("../controllers/catalogController");

const router = express.Router();

router.get("/", deliverySlots.list);
router.post("/", deliverySlots.create);
router.get("/:id", deliverySlots.get);
router.put("/:id", deliverySlots.update);
router.delete("/:id", deliverySlots.remove);

module.exports = router;
