const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("crypto");
const mongoose = require("mongoose");

// Disable buffering so unmocked operations fail fast instead of hanging
mongoose.set("bufferCommands", false);

const DigitalPass = require("../models/DigitalPass");
const User = require("../models/User");
const LeaveRequest = require("../models/LeaveRequest");
const HostelViolation = require("../models/HostelViolation");
const GateEntryExit = require("../models/GateEntryExit");
const { verifyPass } = require("../controllers/digitalPassController");
const { recordMovement } = require("../controllers/gateLogController");

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
    populate: () => query,
    sort: () => query,
    lean: async () => result,
    then: (resolve, reject) => Promise.resolve(result).then(resolve, reject),
  };
  return query;
};

test("verifyPass: returns 400 if no credentials provided", async () => {
  const req = { body: {}, query: {} };
  const res = mockRes();

  await verifyPass(req, res);

  assert.equal(res.statusCode, 400);
  assert.equal(res.body.authorized, false);
  assert.equal(res.body.denialReason, "No pass identification credentials received.");
});

test("verifyPass: returns 404 unauthorized if pass does not exist in database", async () => {
  const originalFindOne = DigitalPass.findOne;
  DigitalPass.findOne = () => mockQuery(null);

  try {
    const req = {
      body: {
        passNumber: "SP-NONEXISTENT-9999",
      },
      query: {},
    };
    const res = mockRes();

    await verifyPass(req, res);

    assert.equal(res.statusCode, 404);
    assert.equal(res.body.success, false);
    assert.equal(res.body.authorized, false);
    assert.match(res.body.denialReason, /unrecognized|unverified|revoked/i);
  } finally {
    DigitalPass.findOne = originalFindOne;
  }
});

test("verifyPass: returns 200 authorized for valid active pass in database", async () => {
  const originalFindOne = DigitalPass.findOne;
  const originalLeaveFindOne = LeaveRequest.findOne;
  const originalViolationFind = HostelViolation.find;

  const validToken = "test-crypto-token-12345";
  const tokenHash = crypto.createHash("sha256").update(validToken).digest("hex");

  const mockPass = {
    _id: new mongoose.Types.ObjectId(),
    passNumber: "SP-2026-102030",
    studentRegistrationId: "STD-2026-090",
    studentName: "Ahamed Nafeesh",
    tokenHash,
    status: "Active",
    validFrom: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    lastMovementDirection: "IN",
    room: "Block B - Room 204",
    building: "Olu Block",
    student: {
      _id: new mongoose.Types.ObjectId(),
      name: "Ahamed Nafeesh",
      registrationNumber: "STD-2026-090",
      accountStatus: "active",
      room: "Block B - Room 204",
      building: "Olu Block",
    },
  };

  DigitalPass.findOne = () => mockQuery(mockPass);
  LeaveRequest.findOne = () => mockQuery(null);
  HostelViolation.find = () => mockQuery([]);

  try {
    const req = {
      body: {
        qrToken: validToken,
      },
      query: {},
    };
    const res = mockRes();

    await verifyPass(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.authorized, true);
    assert.equal(res.body.data.passNumber, "SP-2026-102030");
    assert.equal(res.body.data.currentLocation, "Inside Campus");
    assert.equal(res.body.data.student.name, "Ahamed Nafeesh");
    assert.equal(res.body.data.canExitCampus, true);
    assert.equal(res.body.data.canEnterCampus, false);
  } finally {
    DigitalPass.findOne = originalFindOne;
    LeaveRequest.findOne = originalLeaveFindOne;
    HostelViolation.find = originalViolationFind;
  }
});

test("verifyPass: denies authorization if pass has expired", async () => {
  const originalFindOne = DigitalPass.findOne;
  const originalLeaveFindOne = LeaveRequest.findOne;
  const originalViolationFind = HostelViolation.find;

  const mockPass = {
    _id: new mongoose.Types.ObjectId(),
    passNumber: "SP-2026-EXPIRED",
    studentRegistrationId: "STD-2026-090",
    status: "Active",
    validFrom: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000),
    validUntil: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // Expired 10 days ago
    lastMovementDirection: "IN",
    student: {
      _id: new mongoose.Types.ObjectId(),
      name: "Ahamed Nafeesh",
      registrationNumber: "STD-2026-090",
      accountStatus: "active",
    },
  };

  DigitalPass.findOne = () => mockQuery(mockPass);
  LeaveRequest.findOne = () => mockQuery(null);
  HostelViolation.find = () => mockQuery([]);

  try {
    const req = {
      body: {
        passNumber: "SP-2026-EXPIRED",
      },
      query: {},
    };
    const res = mockRes();

    await verifyPass(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.authorized, false);
    assert.equal(res.body.denialReason, "Digital Pass has expired.");
  } finally {
    DigitalPass.findOne = originalFindOne;
    LeaveRequest.findOne = originalLeaveFindOne;
    HostelViolation.find = originalViolationFind;
  }
});

test("verifyPass: denies authorization if pass is Revoked", async () => {
  const originalFindOne = DigitalPass.findOne;
  const originalLeaveFindOne = LeaveRequest.findOne;
  const originalViolationFind = HostelViolation.find;

  const mockPass = {
    _id: new mongoose.Types.ObjectId(),
    passNumber: "SP-2026-REVOKED",
    studentRegistrationId: "STD-2026-090",
    status: "Revoked",
    validFrom: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    lastMovementDirection: "IN",
    student: {
      _id: new mongoose.Types.ObjectId(),
      name: "Ahamed Nafeesh",
      registrationNumber: "STD-2026-090",
      accountStatus: "active",
    },
  };

  DigitalPass.findOne = () => mockQuery(mockPass);
  LeaveRequest.findOne = () => mockQuery(null);
  HostelViolation.find = () => mockQuery([]);

  try {
    const req = {
      body: {
        passNumber: "SP-2026-REVOKED",
      },
      query: {},
    };
    const res = mockRes();

    await verifyPass(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.authorized, false);
    assert.match(res.body.denialReason, /Revoked/i);
  } finally {
    DigitalPass.findOne = originalFindOne;
    LeaveRequest.findOne = originalLeaveFindOne;
    HostelViolation.find = originalViolationFind;
  }
});

test("verifyPass: denies authorization if student account is inactive or suspended", async () => {
  const originalFindOne = DigitalPass.findOne;
  const originalLeaveFindOne = LeaveRequest.findOne;
  const originalViolationFind = HostelViolation.find;

  const mockPass = {
    _id: new mongoose.Types.ObjectId(),
    passNumber: "SP-2026-INACTIVE-STU",
    studentRegistrationId: "STD-2026-090",
    status: "Active",
    validFrom: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    lastMovementDirection: "IN",
    student: {
      _id: new mongoose.Types.ObjectId(),
      name: "Suspended Student",
      registrationNumber: "STD-2026-090",
      accountStatus: "suspended", // Account suspended
    },
  };

  DigitalPass.findOne = () => mockQuery(mockPass);
  LeaveRequest.findOne = () => mockQuery(null);
  HostelViolation.find = () => mockQuery([]);

  try {
    const req = {
      body: {
        passNumber: "SP-2026-INACTIVE-STU",
      },
      query: {},
    };
    const res = mockRes();

    await verifyPass(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.authorized, false);
    assert.match(res.body.denialReason, /suspended/i);
  } finally {
    DigitalPass.findOne = originalFindOne;
    LeaveRequest.findOne = originalLeaveFindOne;
    HostelViolation.find = originalViolationFind;
  }
});

test("recordMovement: logs OUT movement and records gate audit log", async () => {
  const originalFindOne = DigitalPass.findOne;
  const originalFindOneAndUpdate = DigitalPass.findOneAndUpdate;
  const originalGateCreate = GateEntryExit.create;
  const originalLeaveFindOne = LeaveRequest.findOne;

  const studentId = new mongoose.Types.ObjectId();
  const passId = new mongoose.Types.ObjectId();
  const officerId = new mongoose.Types.ObjectId();

  const mockPass = {
    _id: passId,
    passNumber: "SP-2026-102030",
    studentRegistrationId: "STD-2026-090",
    studentName: "Ahamed Nafeesh",
    status: "Active",
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    lastMovementDirection: "IN",
    student: {
      _id: studentId,
      name: "Ahamed Nafeesh",
      accountStatus: "active",
    },
  };

  DigitalPass.findOne = () => mockQuery(mockPass);
  DigitalPass.findOneAndUpdate = async () => ({
    ...mockPass,
    lastMovementDirection: "OUT",
  });
  LeaveRequest.findOne = () => mockQuery(null);

  let createdLog = null;
  GateEntryExit.create = async (doc) => {
    createdLog = { _id: new mongoose.Types.ObjectId(), ...doc };
    return createdLog;
  };

  try {
    const req = {
      user: {
        _id: officerId,
        name: "Officer Bandara",
        role: "security",
      },
      body: {
        passNumber: "SP-2026-102030",
        direction: "OUT",
        gateName: "Main Campus Gate 01",
      },
    };
    const res = mockRes();

    await recordMovement(req, res);

    assert.equal(res.statusCode, 201);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.direction, "OUT");
    assert.equal(createdLog.direction, "OUT");
    assert.equal(createdLog.gateName, "Main Campus Gate 01");
    assert.equal(createdLog.officerName, "Officer Bandara");
  } finally {
    DigitalPass.findOne = originalFindOne;
    DigitalPass.findOneAndUpdate = originalFindOneAndUpdate;
    GateEntryExit.create = originalGateCreate;
    LeaveRequest.findOne = originalLeaveFindOne;
  }
});

test("recordMovement: logs IN movement from gate terminal without logged-in officer", async () => {
  const originalFindOne = DigitalPass.findOne;
  const originalFindOneAndUpdate = DigitalPass.findOneAndUpdate;
  const originalGateCreate = GateEntryExit.create;
  const originalLeaveFindOne = LeaveRequest.findOne;
  const originalUserFindOne = User.findOne;

  const studentId = new mongoose.Types.ObjectId();
  const passId = new mongoose.Types.ObjectId();
  const staffId = new mongoose.Types.ObjectId();

  const mockPass = {
    _id: passId,
    passNumber: "SP-2026-102030",
    studentRegistrationId: "STD-2026-090",
    studentName: "Ahamed Nafeesh",
    status: "Active",
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    lastMovementDirection: "OUT", // Outside, returning inside
    student: {
      _id: studentId,
      name: "Ahamed Nafeesh",
      accountStatus: "active",
    },
  };

  DigitalPass.findOne = () => mockQuery(mockPass);
  DigitalPass.findOneAndUpdate = async () => ({
    ...mockPass,
    lastMovementDirection: "IN",
  });
  LeaveRequest.findOne = () => mockQuery(null);
  User.findOne = () => mockQuery({ _id: staffId, name: "Gate 01 Officer" });

  let createdLog = null;
  GateEntryExit.create = async (doc) => {
    createdLog = { _id: new mongoose.Types.ObjectId(), ...doc };
    return createdLog;
  };

  try {
    const req = {
      // Unauthenticated terminal scan (no req.user)
      body: {
        passNumber: "SP-2026-102030",
        direction: "IN",
        gateName: "Main Campus Gate 01",
      },
    };
    const res = mockRes();

    await recordMovement(req, res);

    assert.equal(res.statusCode, 201);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.direction, "IN");
    assert.equal(createdLog.direction, "IN");
    assert.equal(createdLog.officerName, "Gate 01 Officer");
  } finally {
    DigitalPass.findOne = originalFindOne;
    DigitalPass.findOneAndUpdate = originalFindOneAndUpdate;
    GateEntryExit.create = originalGateCreate;
    LeaveRequest.findOne = originalLeaveFindOne;
    User.findOne = originalUserFindOne;
  }
});

test("recordMovement: rejects consecutive duplicate movement (OUT when already OUT)", async () => {
  const originalFindOne = DigitalPass.findOne;

  const mockPass = {
    _id: new mongoose.Types.ObjectId(),
    passNumber: "SP-2026-102030",
    studentRegistrationId: "STD-2026-090",
    studentName: "Ahamed Nafeesh",
    status: "Active",
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    lastMovementDirection: "OUT", // Already outside
    student: {
      _id: new mongoose.Types.ObjectId(),
      name: "Ahamed Nafeesh",
      accountStatus: "active",
    },
  };

  DigitalPass.findOne = () => mockQuery(mockPass);

  try {
    const req = {
      body: {
        passNumber: "SP-2026-102030",
        direction: "OUT",
      },
    };
    const res = mockRes();

    await recordMovement(req, res);

    assert.equal(res.statusCode, 400);
    assert.equal(res.body.success, false);
    assert.match(res.body.message, /already recorded as OUT/i);
  } finally {
    DigitalPass.findOne = originalFindOne;
  }
});

test("recordMovement: rejects consecutive duplicate movement (IN when already IN)", async () => {
  const originalFindOne = DigitalPass.findOne;

  const mockPass = {
    _id: new mongoose.Types.ObjectId(),
    passNumber: "SP-2026-102030",
    studentRegistrationId: "STD-2026-090",
    studentName: "Ahamed Nafeesh",
    status: "Active",
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    lastMovementDirection: "IN", // Already inside
    student: {
      _id: new mongoose.Types.ObjectId(),
      name: "Ahamed Nafeesh",
      accountStatus: "active",
    },
  };

  DigitalPass.findOne = () => mockQuery(mockPass);

  try {
    const req = {
      body: {
        passNumber: "SP-2026-102030",
        direction: "IN",
      },
    };
    const res = mockRes();

    await recordMovement(req, res);

    assert.equal(res.statusCode, 400);
    assert.equal(res.body.success, false);
    assert.match(res.body.message, /already recorded as IN/i);
  } finally {
    DigitalPass.findOne = originalFindOne;
  }
});

test("verifyPass: fallback to studentRegistrationId when passNumber is not found", async () => {
  const originalFindOne = DigitalPass.findOne;
  const originalLeaveFindOne = LeaveRequest.findOne;
  const originalViolationFind = HostelViolation.find;

  const mockPass = {
    _id: new mongoose.Types.ObjectId(),
    passNumber: "SP-2026-REAL-001",
    studentRegistrationId: "STD-2026-090",
    studentName: "Ahamed Nafeesh",
    status: "Active",
    validFrom: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    lastMovementDirection: "IN",
    room: "Block B - Room 204",
    building: "Olu Block",
    student: {
      _id: new mongoose.Types.ObjectId(),
      name: "Ahamed Nafeesh",
      registrationNumber: "STD-2026-090",
      accountStatus: "active",
      room: "Block B - Room 204",
      building: "Olu Block",
    },
  };

  // First call (by passNumber) returns null, second call (by studentRegistrationId) returns mockPass
  let callCount = 0;
  DigitalPass.findOne = (query) => {
    callCount++;
    if (query.studentRegistrationId === "STD-2026-090") {
      return mockQuery(mockPass);
    }
    return mockQuery(null);
  };
  LeaveRequest.findOne = () => mockQuery(null);
  HostelViolation.find = () => mockQuery([]);

  try {
    const req = {
      body: {
        passNumber: "SP-UNKNOWN-MISMATCH",
        studentRegistrationId: "STD-2026-090",
      },
      query: {},
    };
    const res = mockRes();

    await verifyPass(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.authorized, true);
    assert.equal(res.body.data.studentRegistrationId, "STD-2026-090");
    assert.equal(res.body.data.passNumber, "SP-2026-REAL-001");
  } finally {
    DigitalPass.findOne = originalFindOne;
    LeaveRequest.findOne = originalLeaveFindOne;
    HostelViolation.find = originalViolationFind;
  }
});

test("verifyPass: safely treats missing/undefined accountStatus as active", async () => {
  const originalFindOne = DigitalPass.findOne;
  const originalLeaveFindOne = LeaveRequest.findOne;
  const originalViolationFind = HostelViolation.find;

  const mockPass = {
    _id: new mongoose.Types.ObjectId(),
    passNumber: "SP-2026-ACTIVE-LEGACY",
    studentRegistrationId: "STD-2026-090",
    studentName: "Ahamed Nafeesh",
    status: "Active",
    validFrom: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    lastMovementDirection: "IN",
    student: {
      _id: new mongoose.Types.ObjectId(),
      name: "Ahamed Nafeesh",
      registrationNumber: "STD-2026-090",
      // accountStatus is undefined in database lean query
    },
  };

  DigitalPass.findOne = () => mockQuery(mockPass);
  LeaveRequest.findOne = () => mockQuery(null);
  HostelViolation.find = () => mockQuery([]);

  try {
    const req = {
      body: {
        passNumber: "SP-2026-ACTIVE-LEGACY",
      },
      query: {},
    };
    const res = mockRes();

    await verifyPass(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.authorized, true);
    assert.equal(res.body.data.student.accountStatus, "active");
  } finally {
    DigitalPass.findOne = originalFindOne;
    LeaveRequest.findOne = originalLeaveFindOne;
    HostelViolation.find = originalViolationFind;
  }
});

test("recordMovement: resolves staff officer when student user is logged in", async () => {
  const originalFindOne = DigitalPass.findOne;
  const originalFindOneAndUpdate = DigitalPass.findOneAndUpdate;
  const originalGateCreate = GateEntryExit.create;
  const originalLeaveFindOne = LeaveRequest.findOne;
  const originalUserFindOne = User.findOne;

  const studentId = new mongoose.Types.ObjectId();
  const passId = new mongoose.Types.ObjectId();
  const designatedStaffId = new mongoose.Types.ObjectId();

  const mockPass = {
    _id: passId,
    passNumber: "SP-2026-102030",
    studentRegistrationId: "STD-2026-090",
    studentName: "Ahamed Nafeesh",
    status: "Active",
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    lastMovementDirection: "OUT",
    student: {
      _id: studentId,
      name: "Ahamed Nafeesh",
      accountStatus: "active",
    },
  };

  DigitalPass.findOne = () => mockQuery(mockPass);
  DigitalPass.findOneAndUpdate = async () => ({
    ...mockPass,
    lastMovementDirection: "IN",
  });
  LeaveRequest.findOne = () => mockQuery(null);
  User.findOne = () => mockQuery({ _id: designatedStaffId, name: "Designated Security Officer" });

  let createdLog = null;
  GateEntryExit.create = async (doc) => {
    createdLog = { _id: new mongoose.Types.ObjectId(), ...doc };
    return createdLog;
  };

  try {
    const req = {
      // Logged in as student on their phone/browser
      user: {
        _id: studentId,
        name: "Ahamed Nafeesh",
        role: "student",
      },
      body: {
        passNumber: "SP-2026-102030",
        direction: "IN",
        gateName: "Main Campus Gate 01",
      },
    };
    const res = mockRes();

    await recordMovement(req, res);

    assert.equal(res.statusCode, 201);
    assert.equal(res.body.success, true);
    // Scanned officer must NOT be student; it must resolve designated staff
    assert.equal(createdLog.officerName, "Designated Security Officer");
    assert.equal(String(createdLog.scannedBy), String(designatedStaffId));
  } finally {
    DigitalPass.findOne = originalFindOne;
    DigitalPass.findOneAndUpdate = originalFindOneAndUpdate;
    GateEntryExit.create = originalGateCreate;
    LeaveRequest.findOne = originalLeaveFindOne;
    User.findOne = originalUserFindOne;
  }
});

test("gateTerminalOrRoleAuth: allows terminal pass movement even when student token is attached", async () => {
  const { gateTerminalOrRoleAuth } = require("../routes/gateLogRoutes");
  const middleware = gateTerminalOrRoleAuth("security", "admin", "warden");

  const req = {
    method: "POST",
    headers: {
      authorization: "Bearer demo-token-student",
    },
    cookies: {},
    body: {
      passNumber: "SP-2026-102030",
      direction: "OUT",
    },
  };
  const res = mockRes();
  let nextCalled = false;

  await new Promise((resolve) => {
    middleware(req, res, (err) => {
      assert.ifError(err);
      nextCalled = true;
      resolve();
    });
    // In case middleware responds instead of calling next
    setTimeout(resolve, 50);
  });

  assert.equal(nextCalled, true, "Middleware should call next() for gate terminal pass movement");
});

test("gateTerminalOrRoleAuth: blocks student when neither staff role nor pass credentials are provided", async () => {
  const { gateTerminalOrRoleAuth } = require("../routes/gateLogRoutes");
  const middleware = gateTerminalOrRoleAuth("security", "admin", "warden");

  const req = {
    method: "POST",
    headers: {
      authorization: "Bearer demo-token-student",
    },
    cookies: {},
    body: {
      // No pass credentials
      somethingElse: "val",
    },
  };
  const res = mockRes();
  let nextCalled = false;

  await new Promise((resolve) => {
    middleware(req, res, (err) => {
      nextCalled = true;
      resolve();
    });
    setTimeout(resolve, 50);
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 403);
  assert.match(res.body.message, /not authorized/i);
});


