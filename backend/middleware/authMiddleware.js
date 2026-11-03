const jwt = require("jsonwebtoken");
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
    req.user = {
      _id: "6aafe35dc5e56a9f84d1ca40",
      name: roleKey === "warden" ? "Dr. K. Perera" : roleKey === "admin" ? "System Administrator" : "Demo User",
      email: `${roleKey}@campus.edu`,
      role: roleKey,
      accountStatus: "active",
    };
    return next();
  }

  try {
    const secret = process.env.JWT_SECRET || "smartstay_secret_change_later";
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id).select("-passwordHash");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. The user for this token no longer exists.",
      });
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
  authorizeRole,
  normalizeRole,
};
