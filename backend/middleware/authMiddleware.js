const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

/**
 * Standardize role strings across system variations
 */
const normalizeRole = (role) => {
  if (!role) return "";
  const r = String(role).toLowerCase().trim();
  if (r === "hostel_admin" || r === "administrator") return "admin";
  if (r === "security_officer") return "security";
  if (r === "maintenance_staff") return "maintenance";
  if (r === "finance_staff") return "finance";
  if (r === "delivery_person") return "delivery";
  return r;
};

/**
 * Demo personas dictionary
 */
const getDemoPersona = (roleKey) => {
  const norm = normalizeRole(roleKey);
  const personas = {
    student: {
      name: "Ahamed Nafeesh",
      email: "student@smartstay.com",
      registrationNumber: "STD-2026-101",
      studentId: "STD-2026-101",
      room: "Room 101",
      building: "Block A",
    },
    warden: {
      name: "Dr. K. Perera",
      email: "warden@smartstay.com",
      building: "Administrative Complex",
    },
    admin: {
      name: "Dr. K. Perera",
      email: "warden@smartstay.com",
      building: "Administrative Complex",
    },
    vendor: {
      name: "Campus Canteen Vendor",
      email: "vendor@smartstay.com",
      building: "Main Cafeteria Complex",
    },
    maintenance: {
      name: "R. S. Wickramasinghe",
      email: "maintenance@smartstay.com",
      building: "Hostel Services Block",
    },
    executive: {
      name: "Prof. M. H. Razak",
      email: "executive@smartstay.com",
      building: "Senate Building",
    },
  };
  return personas[norm] || personas.student;
};

/**
 * Protect routes: Authenticate JWT token from Cookie or Authorization header
 */
const protect = async (req, res, next) => {
  let token;

  // 1. Check Authorization Bearer header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // 2. Check HTTP-only cookie
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. Authentication token is missing.",
    });
  }

  // Support frontend demo persona tokens across academic evaluations
  if (token && token.startsWith("demo-token-")) {
    const rawRole = token.replace("demo-token-", "");
    const roleKey = normalizeRole(rawRole);
    const demoId = "6aafe35dc5e56a9f84d1ca40";
    const persona = getDemoPersona(roleKey);

    try {
      let dbUser = null;
      if (mongoose.connection.readyState === 1) {
        dbUser = await User.findById(demoId);
        if (!dbUser) {
          dbUser = await User.create({
            _id: demoId,
            email: persona.email,
            passwordHash: "$2a$10$demoHashForEvaluationOnly12345678901234567890",
            role: roleKey,
            accountStatus: "active",
            ...persona,
          });
        } else {
          dbUser.name = persona.name;
          dbUser.email = persona.email;
          dbUser.role = roleKey;
        }
      }
      req.user = dbUser || {
        _id: demoId,
        role: roleKey,
        accountStatus: "active",
        ...persona,
      };
      return next();
    } catch {
      req.user = {
        _id: demoId,
        role: roleKey,
        accountStatus: "active",
        ...persona,
      };
      return next();
    }
  }

  try {
    const secret = process.env.JWT_SECRET || "smartstay_secret_change_later";
    const decoded = jwt.verify(token, secret);

    let user = null;
    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.findById(decoded.id).select("-passwordHash");
      } catch (err) {}
    }

    if (!user) {
      const persona = getDemoPersona(decoded.role);
      user = {
        _id: decoded.id || "6aafe35dc5e56a9f84d1ca40",
        role: decoded.role || "student",
        accountStatus: "active",
        email: decoded.email || persona.email,
        name: persona.name,
        ...persona,
      };
    }

    if (user.accountStatus !== "active") {
      return res.status(403).json({
        success: false,
        message: `Account is ${user.accountStatus}. Please contact administration.`,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. Invalid, expired, or malformed authentication token.",
      error: error.message,
    });
  }
};

/**
 * Optional Authentication: Populates req.user if token is present, does not reject if missing
 */
const optionalAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next();
  }

  if (token && token.startsWith("demo-token-")) {
    const rawRole = token.replace("demo-token-", "");
    const roleKey = normalizeRole(rawRole);
    const persona = getDemoPersona(roleKey);
    req.user = {
      _id: "6aafe35dc5e56a9f84d1ca40",
      role: roleKey,
      ...persona,
    };
    return next();
  }

  try {
    const secret = process.env.JWT_SECRET || "smartstay_secret_change_later";
    const decoded = jwt.verify(token, secret);
    let user = null;
    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.findById(decoded.id).select("-passwordHash");
      } catch (err) {}
    }
    if (!user) {
      const persona = getDemoPersona(decoded.role);
      user = {
        _id: decoded.id || "6aafe35dc5e56a9f84d1ca40",
        role: decoded.role || "student",
        accountStatus: "active",
        email: decoded.email || persona.email,
        name: persona.name,
        ...persona,
      };
    }
    req.user = user;
  } catch {}
  next();
};

/**
 * Role-Based Access Control Middleware
 * Supports multiple allowed roles and role aliases
 */
const authorizeRole = (...allowedRoles) => {
  const normalizedAllowed = allowedRoles.map(normalizeRole);

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please log in first.",
      });
    }

    const userRole = normalizeRole(req.user.role);

    // Admin has superuser access to all administration and staff endpoints
    if (userRole === "admin") {
      return next();
    }

    if (!normalizedAllowed.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user.role}' is not authorized to perform this operation.`,
      });
    }

    next();
  };
};

module.exports = {
  protect,
  optionalAuth,
  authorizeRole,
  normalizeRole,
};
