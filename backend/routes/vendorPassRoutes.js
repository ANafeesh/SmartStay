const express = require("express");
const {
  listPasses,
  getPass,
  createPass,
  verifyPass,
  revokePass,
} = require("../controllers/vendorPassController");

const router = express.Router();

router.get("/", listPasses);
router.post("/", createPass);
router.get("/:id", getPass);
router.post("/:id/verify", verifyPass);
router.patch("/:id/revoke", revokePass);

module.exports = router;
