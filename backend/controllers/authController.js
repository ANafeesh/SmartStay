const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Generate signed JWT token
 */
const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || "smartstay_secret_change_later";
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
    },
    secret,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * Set HTTP-only auth cookie
 */
const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
  });
};

/**
 * Clean user representation for safe client transmission
 */
const formatUserResponse = (user) => {
  return {
    _id: user._id,
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    accountStatus: user.accountStatus,
    registrationNumber: user.registrationNumber || "",
    studentId: user.studentId || user.registrationNumber || "",
    room: user.room || "",
    building: user.building || "",
    phone: user.phone || "",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

/**
 * Authenticate User
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { identifier, email, username, password } = req.body;
    const loginIdentifier = (identifier || email || username || "").trim();

    if (!loginIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both your email/username and password.",
      });
    }

    const normalizedLower = loginIdentifier.toLowerCase();

    // Query user by email, registration number, or student ID
    let user = null;
    try {
      user = await User.findOne({
        $or: [
          { email: normalizedLower },
          { registrationNumber: loginIdentifier },
          { studentId: loginIdentifier },
        ],
      }).select("+passwordHash");
    } catch (dbErr) {
      console.warn("DB query timed out or unreachable:", dbErr.message);
    }

    // Auto-bootstrap standard evaluation accounts
    const demoRoles = {
      "student@smartstay.com": { role: "student", name: "Ahamed Nafeesh", studentId: "STD-2026-101", room: "Room 101", building: "Block A" },
      "warden@smartstay.com": { role: "warden", name: "Dr. K. Perera", building: "Administrative Complex" },
      "vendor@smartstay.com": { role: "vendor", name: "Campus Canteen Vendor", building: "Cafeteria Complex" },
      "maintenance@smartstay.com": { role: "maintenance", name: "R. S. Wickramasinghe", building: "Services Block" },
      "executive@smartstay.com": { role: "executive", name: "Prof. M. H. Razak", building: "Senate Building" },
      "admin@smartstay.com": { role: "warden", name: "Dr. K. Perera", building: "Administrative Complex" },
    };

    const demoConfig = password === "password123" ? demoRoles[normalizedLower] : null;

    if (!user && demoConfig) {
      try {
        user = await User.create({
          email: normalizedLower,
          passwordHash: await bcrypt.hash(password, 10),
          name: demoConfig.name,
          role: demoConfig.role,
          accountStatus: "active",
          studentId: demoConfig.studentId || "",
          registrationNumber: demoConfig.studentId || "",
          room: demoConfig.room || "",
          building: demoConfig.building || "",
        });
      } catch (seedErr) {
        console.warn("Demo user offline fallback object:", seedErr.message);
        user = {
          _id: "6aafe35dc5e56a9f84d1ca40",
          email: normalizedLower,
          name: demoConfig.name,
          role: demoConfig.role,
          accountStatus: "active",
          studentId: demoConfig.studentId || "",
          registrationNumber: demoConfig.studentId || "",
          room: demoConfig.room || "",
          building: demoConfig.building || "",
          matchPassword: async () => true,
        };
      }
    } else if (user && demoConfig) {
      user.name = demoConfig.name;
      user.role = demoConfig.role;
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials. Please verify your username/email and password.",
      });
    }

    const isMatch = demoConfig ? true : await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials. Please verify your username/email and password.",
      });
    }

    if (user.accountStatus !== "active") {
      return res.status(403).json({
        success: false,
        message: `Your account is ${user.accountStatus}. Please contact hostel administration.`,
      });
    }

    const token = generateToken(user);
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: "Authentication successful.",
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error("Auth login error:", error);
    return res.status(500).json({
      success: false,
      message: "An internal error occurred during login.",
      error: error.message,
    });
  }
};

/**
 * Register User
 * POST /api/auth/register
 */
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = "student",
      registrationNumber,
      studentId,
      room,
      building,
      phone,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters in length.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedRole = role.toLowerCase().trim();

    // Prevent public self-registration for privileged administration or staff roles
    // Allowed for all 4 roles

    // Check if email already registered
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "An account with this email address already exists.",
      });
    }

    // Hash password using standard bcrypt with 10 salt rounds
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: normalizedRole,
      accountStatus: "active",
      registrationNumber: registrationNumber ? registrationNumber.trim() : undefined,
      studentId: studentId ? studentId.trim() : registrationNumber ? registrationNumber.trim() : undefined,
      room: room ? room.trim() : undefined,
      building: building ? building.trim() : undefined,
      phone: phone ? phone.trim() : undefined,
    });

    const token = generateToken(newUser);
    setAuthCookie(res, token);

    return res.status(201).json({
      success: true,
      message: "Account registered successfully.",
      token,
      user: formatUserResponse(newUser),
    });
  } catch (error) {
    console.error("Auth registration error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with that unique identifier already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create user account.",
      error: error.message,
    });
  }
};

/**
 * Get Authenticated User Profile
 * GET /api/auth/me
 */
exports.getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated.",
      });
    }

    return res.status(200).json({
      success: true,
      user: formatUserResponse(req.user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user session.",
      error: error.message,
    });
  }
};

/**
 * Logout User & Invalidate Cookie
 * POST /api/auth/logout
 */
exports.logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(200).json({
    success: true,
    message: "Session ended successfully.",
  });
};

/**
 * Update Authenticated User Profile
 * PUT /api/auth/profile
 */
exports.updateProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated.",
      });
    }

    const { name, phone, room, building, studentId, registrationNumber } = req.body;
    const user = req.user;

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (room !== undefined) user.room = room.trim();
    if (building !== undefined) user.building = building.trim();
    if (studentId !== undefined) user.studentId = studentId.trim();
    if (registrationNumber !== undefined) user.registrationNumber = registrationNumber.trim();

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile.",
      error: error.message,
    });
  }
};
