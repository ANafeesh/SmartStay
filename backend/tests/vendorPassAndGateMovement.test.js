const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");

mongoose.set("bufferCommands", false);

const VendorPass = require("../models/VendorPass");
const {
  getActivePass,
  verifyAndRecordMovement,
} = require("../controllers/vendorPassController");

const mockRes = () => {
  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
  };
  return res;
};

const mockQuery = (result) => {
  const query = {
    select: () => query,
    sort: () => query,
    lean: async () => result,
    then: (resolve, reject) => Promise.resolve(result).then(resolve, reject),
  };
  return query;
};

test("verifyAndRecordMovement: returns 400 if token is missing", async () => {
  const req = { body: {} };
  const res = mockRes();

  await verifyAndRecordMovement(req, res);

  assert.equal(res.statusCode, 400);
  assert.equal(res.body.success, false);
  assert.equal(res.body.valid, false);
});

test("verifyAndRecordMovement: logs ENTRY (IN) when vendor is outside", async () => {
  const fakePass = {
    vendorId: "VND-2026-09",
    shopName: "Campus Diner & Cafe",
    deliveryPerson: "Kamal Perera",
    vehicleNo: "WP BCD-4821",
    qrToken: "QR-SS-VND-88492019",
    currentLocation: "Outside",
    validUntil: new Date(Date.now() + 100000),
    status: "Active",
    authorizedZones: ["Hostel Block A", "Hostel Block B"],
    entryLogs: [],
    save: async function () {
      return this;
    },
  };

  const origFindOne = VendorPass.findOne;
  VendorPass.findOne = () => mockQuery(fakePass);

  try {
    const req = {
      body: { token: "QR-SS-VND-88492019", direction: "AUTO" },
      user: { name: "Officer K. Bandara", role: "security" },
    };
    const res = mockRes();

    await verifyAndRecordMovement(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.valid, true);
    assert.equal(res.body.movement, "ENTRY");
    assert.equal(res.body.direction, "IN");
    assert.equal(res.body.currentLocation, "Inside");
    assert.equal(fakePass.currentLocation, "Inside");
    assert.equal(fakePass.entryLogs.length, 1);
    assert.equal(fakePass.entryLogs[0].direction, "IN");
  } finally {
    VendorPass.findOne = origFindOne;
  }
});

test("verifyAndRecordMovement: logs EXIT (OUT) when vendor is already inside", async () => {
  const fakePass = {
    vendorId: "VND-2026-09",
    shopName: "Campus Diner & Cafe",
    deliveryPerson: "Kamal Perera",
    vehicleNo: "WP BCD-4821",
    qrToken: "QR-SS-VND-88492019",
    currentLocation: "Inside",
    validUntil: new Date(Date.now() + 100000),
    status: "Active",
    authorizedZones: ["Hostel Block A", "Hostel Block B"],
    entryLogs: [{ direction: "IN", status: "Granted" }],
    save: async function () {
      return this;
    },
  };

  const origFindOne = VendorPass.findOne;
  VendorPass.findOne = () => mockQuery(fakePass);

  try {
    const req = {
      body: { token: "QR-SS-VND-88492019", direction: "AUTO" },
      user: { name: "Officer K. Bandara", role: "security" },
    };
    const res = mockRes();

    await verifyAndRecordMovement(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.valid, true);
    assert.equal(res.body.movement, "EXIT");
    assert.equal(res.body.direction, "OUT");
    assert.equal(res.body.currentLocation, "Outside");
    assert.equal(fakePass.currentLocation, "Outside");
    assert.equal(fakePass.entryLogs.length, 2);
    assert.equal(fakePass.entryLogs[0].direction, "OUT");
  } finally {
    VendorPass.findOne = origFindOne;
  }
});

test("verifyAndRecordMovement: denies access if pass is revoked", async () => {
  const fakePass = {
    vendorId: "VND-2026-09",
    qrToken: "QR-REVOKED",
    status: "Revoked",
    validUntil: new Date(Date.now() + 100000),
    entryLogs: [],
    save: async function () {
      return this;
    },
  };

  const origFindOne = VendorPass.findOne;
  VendorPass.findOne = () => mockQuery(fakePass);

  try {
    const req = { body: { token: "QR-REVOKED" } };
    const res = mockRes();

    await verifyAndRecordMovement(req, res);

    assert.equal(res.statusCode, 403);
    assert.equal(res.body.valid, false);
    assert.match(res.body.message, /revoked/i);
  } finally {
    VendorPass.findOne = origFindOne;
  }
});
