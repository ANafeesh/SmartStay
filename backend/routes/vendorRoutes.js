const express = require("express");
const { vendors } = require("../controllers/catalogController");

const router = express.Router();

router.get("/", vendors.list);
router.post("/", vendors.create);
router.get("/:id", vendors.get);
router.put("/:id", vendors.update);
router.delete("/:id", vendors.remove);

module.exports = router;
