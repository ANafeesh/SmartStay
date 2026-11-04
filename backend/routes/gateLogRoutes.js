const express = require("express");
const { protect, authorizeRole } = require("../middleware/authMiddleware");
const {
  recordMovement,
  getGateLogs,
  getMyLogs,
  getCampusOccupancyStatus,
  reconcilePendingSideEffects,
  getGateInconsistencies,
} = require("../controllers/gateLogController");

const router = express.Router();

// Middleware allowing authenticated staff or active gatekeeper terminal
const gateTerminalOrRoleAuth = (...allowedRoles) => {
  return (req, res, next) => {
    const hasAuthHeader = req.headers.authorization && req.headers.authorization.startsWith("Bearer ");
    const hasCookie = req.cookies && req.cookies.token;
    const isGateTerminalAction =
      (req.method === "POST" && (req.body?.qrToken || req.body?.passNumber || req.body?.studentRegistrationId)) ||
      req.method === "GET";

    if (hasAuthHeader || hasCookie) {
      return protect(req, res, (err) => {
        if (err) {
          if (isGateTerminalAction) {
            req.user = null;
            return next();
          }
          return next(err);
        }

        const normalizedRole = req.user?.role?.toLowerCase().trim();
        const isAllowed = allowedRoles.some((role) => role.toLowerCase().trim() === normalizedRole);
        if (isAllowed) {
          return next();
        }

        // Allow gatekeeper terminal action even if logged-in persona is student
        if (isGateTerminalAction) {
          return next();
        }

        return res.status(403).json({
          success: false,
          message: `User role '${req.user?.role}' is not authorized to access this route.`,
        });
      });
    }

    // Allow gate terminal movement recording when valid pass credentials are supplied
    if (isGateTerminalAction) {
      return next();
    }

    return res.status(401).json({
      success: false,
      message: "Authentication or valid digital pass credentials required.",
    });
  };
};

// Record campus gate entry or exit (Security Officer, Warden, Admin, or Gate Terminal)
router.post("/", gateTerminalOrRoleAuth("security", "admin", "warden"), recordMovement);

// Reconcile pending or failed post-log side effects (Security Officer or Admin)
router.post("/reconcile", protect, authorizeRole("security", "admin"), reconcilePendingSideEffects);

// Retrieve recorded gate inconsistencies (Security Officer or Admin)
router.get("/inconsistencies", protect, authorizeRole("security", "admin"), getGateInconsistencies);

// Query gate movement logs (Security, Warden, Admin, Executive, Gate Terminal)
router.get("/", gateTerminalOrRoleAuth("security", "warden", "admin", "executive"), getGateLogs);

// Authenticated student views personal gate movement history
router.get("/my-logs", protect, authorizeRole("student", "admin"), getMyLogs);

// Aggregated live inside/outside campus headcount
router.get(
  "/occupancy-status",
  protect,
  authorizeRole("security", "warden", "admin", "executive"),
  getCampusOccupancyStatus
);

module.exports = router;
module.exports.gateTerminalOrRoleAuth = gateTerminalOrRoleAuth;
