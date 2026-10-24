const crypto = require("crypto");
const Vendor = require("../models/Vendor");
const VendorPass = require("../models/VendorPass");

const handleError = (res, error, message) => {
  if (error.code === 11000) {
    return res.status(409).json({ success: false, message: "A record with that identifier already exists." });
  }
  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({ success: false, message: error.message });
  }
  return res.status(500).json({ success: false, message, error: error.message });
};

const listPasses = async (req, res) => {
  try {
    const filter = {};
    ["vendorId", "status"].forEach((field) => {
      if (req.query[field] !== undefined) filter[field] = req.query[field];
    });
    const passes = await VendorPass.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: passes.length, data: passes });
  } catch (error) {
    return handleError(res, error, "Failed to fetch vendor passes.");
  }
};

const getPass = async (req, res) => {
  try {
    const pass = await VendorPass.findById(req.params.id);
    if (!pass) return res.status(404).json({ success: false, message: "Vendor pass not found." });
    return res.status(200).json({ success: true, data: pass });
  } catch (error) {
    return handleError(res, error, "Failed to fetch vendor pass.");
  }
};

const createPass = async (req, res) => {
  try {
    const { vendorId, deliveryPerson, validUntil, authorizedZones = [] } = req.body;
    const vendor = await Vendor.findOne({ vendorId, status: "Active" });
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found." });
    const token = crypto.randomBytes(32).toString("base64url");
    const pass = await VendorPass.create({
      vendorId,
      shopName: vendor.name,
      deliveryPerson,
      riderNic: req.body.riderNic,
      vehicleNo: req.body.vehicleNo,
      vehicleType: req.body.vehicleType,
      tokenHash: crypto.createHash("sha256").update(token).digest("hex"),
      validFrom: req.body.validFrom || new Date(),
      validUntil,
      authorizedZones,
    });
    return res.status(201).json({
      success: true,
      message: "Pass token is returned only once. Store it securely in the QR code.",
      data: { pass, qrToken: token },
    });
  } catch (error) {
    return handleError(res, error, "Failed to create vendor pass.");
  }
};

const verifyPass = async (req, res) => {
  try {
    const pass = await VendorPass.findById(req.params.id).select("+tokenHash");
    if (!pass) return res.status(404).json({ success: false, message: "Vendor pass not found." });

    const token = String(req.body.token || "");
    const suppliedHash = crypto.createHash("sha256").update(token).digest();
    const storedHash = Buffer.from(pass.tokenHash, "hex");
    const tokenMatches =
      suppliedHash.length === storedHash.length && crypto.timingSafeEqual(suppliedHash, storedHash);
    const now = new Date();
    const valid =
      tokenMatches &&
      pass.status === "Active" &&
      pass.validFrom <= now &&
      pass.validUntil > now;

    pass.entryLogs.push({
      scannedAt: now,
      gate: req.body.gate || "",
      dropZone: req.body.dropZone || "",
      status: valid ? "Granted" : "Denied",
    });
    await pass.save();

    if (!valid) {
      return res.status(403).json({ success: true, valid: false, message: "Pass is invalid, expired, or revoked." });
    }
    return res.status(200).json({
      success: true,
      valid: true,
      data: {
        vendorId: pass.vendorId,
        shopName: pass.shopName,
        deliveryPerson: pass.deliveryPerson,
        vehicleNo: pass.vehicleNo,
        authorizedZones: pass.authorizedZones,
        validUntil: pass.validUntil,
      },
    });
  } catch (error) {
    return handleError(res, error, "Failed to verify vendor pass.");
  }
};

const revokePass = async (req, res) => {
  try {
    const pass = await VendorPass.findByIdAndUpdate(
      req.params.id,
      { $set: { status: "Revoked" } },
      { new: true, runValidators: true },
    );
    if (!pass) return res.status(404).json({ success: false, message: "Vendor pass not found." });
    return res.status(200).json({ success: true, data: pass });
  } catch (error) {
    return handleError(res, error, "Failed to revoke vendor pass.");
  }
};

module.exports = { listPasses, getPass, createPass, verifyPass, revokePass };
