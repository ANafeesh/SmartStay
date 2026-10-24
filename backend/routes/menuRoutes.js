const express = require("express");
const { menuItems } = require("../controllers/catalogController");

const router = express.Router();

router.get("/", menuItems.list);
router.post("/", menuItems.create);
router.get("/:id", menuItems.get);
router.put("/:id", menuItems.update);
router.delete("/:id", menuItems.remove);

module.exports = router;
