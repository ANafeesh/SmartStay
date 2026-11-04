import { apiFetch } from "./apiClient";

const STORAGE_PREFIX = "smartstay_gate_pass_";

/**
 * Fetch student's real digital pass from the backend
 */
export async function fetchMyDigitalPass() {
  const res = await apiFetch("/digital-passes/my-pass");
  return res.data;
}

/**
 * Verify a digital pass by QR token, pass number, or student ID
 */
export async function verifyDigitalPass({ qrToken, passNumber, studentRegistrationId }) {
  const res = await apiFetch("/digital-passes/verify", {
    method: "POST",
    body: {
      qrToken,
      passNumber,
      studentRegistrationId,
    },
  });
  return res;
}

/**
 * Submit campus entry/exit movement to backend gate logs
 */
export async function recordGateMovementApi({
  qrToken,
  passNumber,
  studentRegistrationId,
  direction,
  gateName = "Main Campus Gate 01",
  remarks = "",
}) {
  const res = await apiFetch("/gate-logs", {
    method: "POST",
    body: {
      qrToken,
      passNumber,
      studentRegistrationId,
      direction,
      gateName,
      remarks,
    },
  });
  return res;
}

/**
 * Fetch gate logs audit trail
 */
export async function fetchGateLogsApi(params = {}) {
  const query = new URLSearchParams(params).toString();
  const endpoint = `/gate-logs${query ? `?${query}` : ""}`;
  return await apiFetch(endpoint);
}

/**
 * Generates or retrieves the student's unique digital pass info (fallback / display helper)
 */
export function getStudentPassDetails(user) {
  const isDemo = user?.isDemo || user?.email === "nafeesh@campus.edu";
  const studentId = user?.studentId || user?.registrationNumber || (isDemo ? "STD-2026-090" : "STD-NEW");
  const name = user?.name || (isDemo ? "Ahamed Nafeesh" : "Student User");
  const room = user?.room || (isDemo ? "Block B - Room 204" : "Not Allocated");
  const building = user?.building || (isDemo ? "Olu Block" : "Campus Residence");

  const passNumber = `SP-2026-${studentId.replace(/[^a-zA-Z0-9]/g, "").slice(-4) || "090"}`;
  const passToken = `QR-SS-STU-${studentId.replace(/[^a-zA-Z0-9]/g, "")}-${passNumber}`;

  return {
    studentId,
    name,
    room,
    building,
    passNumber,
    passToken,
    status: "Active",
    validUntil: "End of Academic Semester 2026/27",
  };
}

/**
 * Returns student's live location and movement history from localStorage
 */
export function getGateMovementState(studentId = "STD-2026-090") {
  const key = `${STORAGE_PREFIX}${studentId}`;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Ignore storage parse error
  }

  // Default state: Student is currently INSIDE campus
  const defaultState = {
    currentLocation: "INSIDE", // "INSIDE" | "OUTSIDE"
    lastMovement: {
      direction: "IN",
      time: "Today, 08:30 AM",
      gate: "Main Campus Gate 01",
      officer: "Officer K. Bandara",
      status: "Granted",
    },
    logs: [
      {
        id: "LOG-GATE-9841",
        direction: "IN",
        time: "Today, 08:30 AM",
        gate: "Main Campus Gate 01",
        officer: "Officer K. Bandara",
        status: "Granted",
        remarks: "Regular campus return",
      },
      {
        id: "LOG-GATE-9720",
        direction: "OUT",
        time: "Yesterday, 06:15 PM",
        gate: "Main Campus Gate 01",
        officer: "Officer M. Farook",
        status: "Granted",
        remarks: "Town visit with clearance",
      },
    ],
  };

  try {
    localStorage.setItem(key, JSON.stringify(defaultState));
  } catch {
    // Ignore
  }

  return defaultState;
}

/**
 * Records an Exit or Entry movement for the student.
 * If targetDirection is provided ("IN" or "OUT"), uses it.
 * Calls backend API if available, falls back to local storage cache.
 */
export async function recordStudentMovement({
  studentId,
  studentName = "Student",
  room = "Room Assigned",
  targetDirection = null,
  gateName = "Main Campus Gate 01",
  officerName = "Officer on Duty (Gate 01)",
  qrToken = null,
  passNumber = null,
}) {
  const state = getGateMovementState(studentId);

  const direction =
    targetDirection || (state.currentLocation === "INSIDE" ? "OUT" : "IN");

  const now = new Date();
  const timeFormatted = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateFormatted = now.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const isExit = direction === "OUT";
  const newLocation = isExit ? "OUTSIDE" : "INSIDE";

  let backendResponse = null;
  let backendError = null;

  // Try authentic backend API
  try {
    const payload = {
      direction,
      gateName,
      remarks: isExit
        ? "Student Gate Movement (OUT)"
        : "Student Gate Movement (IN)",
    };
    if (qrToken) {
      payload.qrToken = qrToken;
    } else if (passNumber) {
      payload.passNumber = passNumber;
    } else {
      payload.studentRegistrationId = studentId;
    }

    backendResponse = await recordGateMovementApi(payload);
  } catch (err) {
    backendError = err.data?.message || err.message;
  }

  if (backendError) {
    return {
      success: false,
      direction,
      actionLabel: isExit ? "EXIT" : "ENTER",
      message: backendError,
      studentId,
      studentName,
      room,
      gateName,
      time: `${dateFormatted}, ${timeFormatted}`,
      officer: officerName,
      newLocation: state.currentLocation,
      state,
      error: backendError,
    };
  }

  const newLog = {
    id: `LOG-GATE-${Math.floor(1000 + Math.random() * 9000)}`,
    direction,
    time: `${dateFormatted}, ${timeFormatted}`,
    gate: gateName,
    officer: officerName,
    status: "Granted",
    remarks: isExit
      ? "Student checked OUT of campus"
      : "Student checked IN to campus",
  };

  const updatedState = {
    currentLocation: newLocation,
    lastMovement: newLog,
    logs: [newLog, ...(state.logs || [])].slice(0, 20),
  };

  try {
    localStorage.setItem(
      `${STORAGE_PREFIX}${studentId}`,
      JSON.stringify(updatedState)
    );
  } catch {
    // Ignore
  }

  return {
    success: true,
    direction,
    actionLabel: isExit ? "EXIT" : "ENTER",
    message:
      backendResponse?.message ||
      (isExit
        ? "EXIT Approved: Student successfully checked OUT of campus"
        : "ENTER Approved: Student successfully checked IN to campus"),
    studentId,
    studentName,
    room,
    gateName,
    time: `${dateFormatted}, ${timeFormatted}`,
    officer: officerName,
    newLocation,
    state: updatedState,
    backendData: backendResponse?.data,
  };
}
