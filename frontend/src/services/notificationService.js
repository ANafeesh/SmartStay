/**
 * Centralized Notification Service for SmartStay
 * Handles live backend notifications from /api/payment-notifications
 * and dynamically aggregates real student data (complaints, payments/bills,
 * food orders, room allocation, gate passes) with persistent read/delete status.
 */

import { apiFetch } from "./apiClient";
import { readStoredComplaints } from "../pages/student/Complaints";
import { readFoodOrders } from "../data/foodOrders";
import { getGateMovementState } from "./gatePassService";
import { isDemoUser } from "../context/AuthContext";

const NOTIFICATIONS_STORAGE_KEY = "smartstay_student_notifications";

/**
 * Format timestamp into standard display date & time
 */
export function formatNotifDateTime(timestamp) {
  if (!timestamp) return { date: "Today", time: "Just now" };
  const d = new Date(timestamp);
  if (isNaN(d.getTime())) return { date: "Today", time: "Just now" };

  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  const isYesterday =
    new Date(now.getTime() - 86400000).getDate() === d.getDate() &&
    new Date(now.getTime() - 86400000).getMonth() === d.getMonth();

  const timeStr = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isToday) return { date: "Today", time: timeStr };
  if (isYesterday) return { date: "Yesterday", time: timeStr };

  return {
    date: d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: timeStr,
  };
}

/**
 * Get all possible user identifier keys to prevent key mismatches across sessions
 */
export function getPossibleUserKeys(user) {
  const keys = new Set();
  if (!user) {
    keys.add("guest");
    return Array.from(keys);
  }
  if (typeof user === "string") {
    keys.add(user.toLowerCase().trim());
    return Array.from(keys);
  }
  if (user.email) keys.add(user.email.toLowerCase().trim());
  if (user.studentId) keys.add(String(user.studentId).trim());
  if (user.registrationNumber) keys.add(String(user.registrationNumber).trim());
  if (user._id) keys.add(String(user._id).trim());
  if (user.id) keys.add(String(user.id).trim());
  if (keys.size === 0) keys.add("guest");
  return Array.from(keys);
}

/**
 * Get read set for user across all aliases
 */
export function getReadSet(user) {
  const readSet = new Set();
  const keys = getPossibleUserKeys(user);
  keys.forEach((k) => {
    try {
      const raw = localStorage.getItem(`smartstay_read_notifs_${k}`);
      if (raw) {
        JSON.parse(raw).forEach((id) => readSet.add(String(id)));
      }
    } catch { }
  });
  return readSet;
}

/**
 * Save read set for user across all aliases
 */
export function saveReadSet(user, set) {
  const keys = getPossibleUserKeys(user);
  const arr = Array.from(set);
  keys.forEach((k) => {
    try {
      localStorage.setItem(`smartstay_read_notifs_${k}`, JSON.stringify(arr));
    } catch { }
  });
}

/**
 * Get deleted set for user across all aliases
 */
export function getDeletedSet(user) {
  const deletedSet = new Set();
  const keys = getPossibleUserKeys(user);
  keys.forEach((k) => {
    try {
      const raw = localStorage.getItem(`smartstay_deleted_notifs_${k}`);
      if (raw) {
        JSON.parse(raw).forEach((id) => deletedSet.add(String(id)));
      }
    } catch { }
  });
  return deletedSet;
}

/**
 * Save deleted set for user across all aliases
 */
export function saveDeletedSet(user, set) {
  const keys = getPossibleUserKeys(user);
  const arr = Array.from(set);
  keys.forEach((k) => {
    try {
      localStorage.setItem(`smartstay_deleted_notifs_${k}`, JSON.stringify(arr));
    } catch { }
  });
}

/**
 * Get custom pushed notifications for user
 */
function getCustomNotifs(userKey) {
  try {
    const raw = localStorage.getItem(`smartstay_custom_notifs_${userKey}`);
    if (raw) return JSON.parse(raw);
  } catch { }
  return [];
}

/**
 * Save custom pushed notifications for user
 */
function saveCustomNotifs(userKey, list) {
  try {
    localStorage.setItem(
      `smartstay_custom_notifs_${userKey}`,
      JSON.stringify(list)
    );
  } catch { }
}

/**
 * Build real local student notifications from actual system state
 */
export function buildRealLocalNotifications(user) {
  const isDemo =
    isDemoUser(user) || user?.isDemo || user?.email === "nafeesh@campus.edu";
  const userKey = user?._id || user?.id || user?.email || "guest";
  const studentRegId =
    user?.studentId ||
    user?.registrationNumber ||
    (isDemo ? "STD-2026-101" : "STD-NEW");
  const studentName = user?.name || (isDemo ? "Ahamed Nafesh" : "Student");
  const roomName = user?.room || (isDemo ? "Block B - Room 204" : "");

  const readSet = getReadSet(userKey);
  const deletedSet = getDeletedSet(userKey);
  const notifs = [];

  // 1. Room Allocation Notification (real room info)
  if (roomName) {
    const id = `room-alloc-${studentRegId}`;
    if (!deletedSet.has(id)) {
      notifs.push({
        id,
        title: "Room Allocation Confirmed",
        message: `Your room ${roomName} allocation is active and verified for the 2026 academic term.`,
        date: "Today",
        time: "08:30 AM",
        type: "room",
        read: readSet.has(id),
        timestamp: Date.now() - 3600000 * 24 * 3,
      });
    }
  }

  // 2. Real Maintenance Complaints
  try {
    let studentComplaints = [];
    if (isDemo) {
      const stored = readStoredComplaints();
      studentComplaints = Array.isArray(stored) ? stored : [];
    } else {
      const rawUserComplaints = localStorage.getItem(
        `smartstay_complaints_${userKey}`
      );
      if (rawUserComplaints) {
        studentComplaints = JSON.parse(rawUserComplaints);
      }
    }

    // If demo and no stored complaints yet, provide initial ones
    if (studentComplaints.length === 0 && isDemo) {
      studentComplaints = [
        {
          id: "CMP-2026-001",
          title: "Study Table Light Broken",
          category: "Electrical",
          status: "In Progress",
          date: "Yesterday",
        },
        {
          id: "CMP-2026-002",
          title: "Bathroom Water Pressure Low",
          category: "Plumbing",
          status: "Assigned",
          date: "2 days ago",
        },
      ];
    }

    studentComplaints.forEach((c) => {
      const id = `cmp-${c.id || c.complaintId}`;
      if (!deletedSet.has(id)) {
        const isResolved = c.status === "Resolved";
        const isInProgress = c.status === "In Progress";
        notifs.push({
          id,
          title: isResolved
            ? "Maintenance Request Resolved"
            : isInProgress
              ? "Complaint Assigned to Technician"
              : "Complaint Logged with Warden",
          message: `Complaint #${c.id || c.complaintId} (${c.title || c.category}) status: ${c.status || "Pending"}.`,
          date: c.date || "Today",
          time: "09:15 AM",
          type: "maintenance",
          read: readSet.has(id),
          timestamp: Date.now() - 3600000 * 4,
        });
      }
    });
  } catch (err) {
    console.warn("Could not aggregate complaint notifications:", err);
  }

  // 3. Real Food Orders
  try {
    const orders = readFoodOrders();
    const myOrders = Array.isArray(orders)
      ? orders.filter(
        (o) =>
          o.studentId === studentRegId ||
          o.studentRegNo === studentRegId ||
          (isDemo && (!o.studentId || o.studentId === "STD-2026-101"))
      )
      : [];

    myOrders.forEach((order) => {
      const id = `order-${order.id || order.orderNo}`;
      if (!deletedSet.has(id)) {
        const isReady =
          order.status === "Ready" ||
          order.status === "Delivered" ||
          order.status === "Out for Delivery";
        notifs.push({
          id,
          title: isReady
            ? `Food Order ${order.status}`
            : "Food Order Received",
          message: `Your food order #${order.orderNo || order.id} from ${order.vendor || "Campus Bites"
            } is ${order.status || "Processing"}.`,
          date: order.date || "Today",
          time: order.time || "12:45 PM",
          type: "food",
          read: readSet.has(id),
          timestamp: Date.now() - 3600000 * 2,
        });
      }
    });
  } catch (err) {
    console.warn("Could not aggregate food notifications:", err);
  }

  // 4. Real Billing & Payments
  try {
    let myBills = [];
    let myPayments = [];

    const rawBills = localStorage.getItem(`smartstay_bills_${userKey}`);
    if (rawBills) myBills = JSON.parse(rawBills);

    const rawPayments = localStorage.getItem(`smartstay_payments_${userKey}`);
    if (rawPayments) myPayments = JSON.parse(rawPayments);

    if (myPayments.length > 0) {
      myPayments.forEach((p, idx) => {
        const id = `pay-${p.id || p.refNo || idx}`;
        if (!deletedSet.has(id)) {
          notifs.push({
            id,
            title: "Payment Received",
            message: `Your payment of Rs. ${Number(
              p.amount || 0
            ).toLocaleString()} (${p.billTitle || p.type || "Hostel Fee"}) was successfully verified.`,
            date: p.date || "Today",
            time: "10:30 AM",
            type: "payment",
            read: readSet.has(id),
            timestamp: Date.now() - 3600000 * 8,
          });
        }
      });
    } else if (isDemo) {
      const id = "pay-initial-01";
      if (!deletedSet.has(id)) {
        notifs.push({
          id,
          title: "Payment Received",
          message:
            "Your Utility Charge payment of Rs. 2,500 was received successfully.",
          date: "Yesterday",
          time: "10:30 AM",
          type: "payment",
          read: readSet.has(id),
          timestamp: Date.now() - 3600000 * 20,
        });
      }
    }

    if (myBills.length > 0) {
      myBills
        .filter((b) => b.status === "Unpaid" || b.status === "Due")
        .forEach((b) => {
          const id = `bill-due-${b.id || b.billNo}`;
          if (!deletedSet.has(id)) {
            notifs.push({
              id,
              title: "Payment Reminder",
              message: `Your ${b.title || b.type || "Hostel Fee"} of Rs. ${Number(
                b.amount || 0
              ).toLocaleString()} is pending. Due date: ${b.dueDate || "Soon"}.`,
              date: "Today",
              time: "09:00 AM",
              type: "payment",
              read: readSet.has(id),
              timestamp: Date.now() - 3600000 * 6,
            });
          }
        });
    }
  } catch (err) {
    console.warn("Could not aggregate billing notifications:", err);
  }

  // 5. Real Digital Gate Pass / Curfew Activity
  try {
    const gateState = getGateMovementState(studentRegId);
    if (gateState?.lastMovementTime) {
      const id = `gate-${studentRegId}`;
      if (!deletedSet.has(id)) {
        notifs.push({
          id,
          title: "Gate Movement Verified",
          message: `Official gate check logged: Status is currently "${gateState.currentStatus}" (Pass ${gateState.passNumber}).`,
          date: "Today",
          time: gateState.lastMovementTime || "Just now",
          type: "room",
          read: readSet.has(id),
          timestamp: Date.now() - 3600000 * 1,
        });
      }
    }
  } catch { }

  // 6. Custom Pushed Notifications (e.g. from actions in other tabs)
  const customList = getCustomNotifs(userKey);
  customList.forEach((c) => {
    if (!deletedSet.has(c.id)) {
      notifs.push({
        ...c,
        read: readSet.has(c.id) || c.read,
      });
    }
  });

  // Sort newest first
  return notifs.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
}

/**
 * Fetch unified notifications: checks live backend first, then combines with real local data
 */
export async function fetchUnifiedNotifications(user) {
  const isDemo =
    isDemoUser(user) || user?.isDemo || user?.email === "nafeesh@campus.edu";
  const userKey = user?._id || user?.id || user?.email || "guest";
  const studentRegId =
    user?.studentId ||
    user?.registrationNumber ||
    (isDemo ? "STD-2026-101" : "STD-NEW");

  const readSet = getReadSet(userKey);
  const deletedSet = getDeletedSet(userKey);

  let backendNotifs = [];

  // Try backend API if token or live environment is available
  try {
    const res = await apiFetch(`/payment-notifications?recipientId=${encodeURIComponent(studentRegId)}`);
    if (res?.data && Array.isArray(res.data)) {
      backendNotifs = res.data.map((item) => {
        const { date, time } = formatNotifDateTime(item.createdAt);
        let categoryType = "payment";
        const ref = (item.referenceType || "").toLowerCase();
        if (ref.includes("complaint") || ref.includes("maintenance")) {
          categoryType = "maintenance";
        } else if (ref.includes("food") || ref.includes("order")) {
          categoryType = "food";
        } else if (ref.includes("room") || ref.includes("gate")) {
          categoryType = "room";
        }

        const id = String(item._id || item.id);
        const itemKey = `${item.title?.trim()}:${item.message?.trim()}`; const isRead = !!item.readAt || readSet.has(id) || readSet.has(itemKey);

        return {
          id,
          backendId: item._id,
          title: item.title,
          message: item.message,
          type: categoryType,
          date,
          time,
          read: isRead,
          timestamp: item.createdAt ? new Date(item.createdAt).getTime() : Date.now(),
        };
      });
    }
  } catch (err) {
    // Backend fetch failed or offline; fallback to real local aggregator
  }

  // Combine with real local data
  const localNotifs = buildRealLocalNotifications(user);

  // Merge unique by title & message or id
  const seenKeys = new Set();
  const merged = [];

  // Backend items take priority
  backendNotifs.forEach((item) => {
    const itemKey = `${item.title?.trim()}:${item.message?.trim()}`; if (!deletedSet.has(item.id) && !deletedSet.has(itemKey)) {
      const key = `${item.title}:${item.message}`;
      seenKeys.add(key);
      seenKeys.add(item.id);
      merged.push(item);
    }
  });

  // Then local real notifications
  localNotifs.forEach((item) => {
    if (!deletedSet.has(item.id)) {
      const key = `${item.title}:${item.message}`;
      if (!seenKeys.has(key) && !seenKeys.has(item.id)) {
        seenKeys.add(key);
        seenKeys.add(item.id);
        merged.push(item);
      }
    }
  });

  // Sort by timestamp
  merged.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  // Sync to localStorage
  try {
    localStorage.setItem(
      `smartstay_student_notifications_${userKey}`,
      JSON.stringify(merged)
    );
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(merged));
  } catch { }

  return merged;
}

/**
 * Mark a single notification as read
 */
export async function markNotificationAsRead(id, user, backendId) {
  const userKey = user?._id || user?.id || user?.email || "guest";
  const readSet = getReadSet(userKey);
  const strId = String(id);
  readSet.add(strId);
  if (backendId) readSet.add(String(backendId));
  saveReadSet(userKey, readSet);

  // Update cached student notifications in localStorage immediately
  let newUnreadCount = 0;
  try {
    const raw = localStorage.getItem(`smartstay_student_notifications_${userKey}`);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        const updatedList = list.map((item) => {
          const match =
            String(item.id) === strId ||
            (backendId && String(item.backendId) === String(backendId)) ||
            (item.backendId && String(item.backendId) === strId) ||
            (backendId && String(item.id) === String(backendId));
          return match ? { ...item, read: true } : item;
        });
        localStorage.setItem(`smartstay_student_notifications_${userKey}`, JSON.stringify(updatedList));
        localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updatedList));

        const deletedSet = getDeletedSet(userKey);
        newUnreadCount = updatedList.filter((n) => {
          const isDeleted = deletedSet.has(String(n.id)) || (n.backendId && deletedSet.has(String(n.backendId)));
          if (isDeleted) return false;
          const isRead = n.read || readSet.has(String(n.id)) || (n.backendId && readSet.has(String(n.backendId)));
          return !isRead;
        }).length;
      }
    }
  } catch { }

  // Immediately broadcast update so badge and UI decrease in real time
  window.dispatchEvent(
    new CustomEvent("smartstay-notifications-updated", {
      detail: { readId: id, backendId, unreadCount: newUnreadCount },
    })
  );

  // Asynchronously sync with backend in background
  try {
    const targetId = backendId || id;
    await apiFetch(`/payment-notifications/${encodeURIComponent(targetId)}/read`, {
      method: "PATCH",
    });
  } catch { }

  return newUnreadCount;
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(notifications, user) {
  const userKey = getPossibleUserKeys(user)[0] || "guest";
  const readSet = getReadSet(user);

  (notifications || []).forEach((n) => {
    readSet.add(String(n.id));
    if (n.backendId) readSet.add(String(n.backendId));
    if (n.title && n.message) {
      readSet.add(`${n.title.trim()}:${n.message.trim()}`);
    }
  });
  saveReadSet(user, readSet);

  // Update cached student notifications in localStorage
  try {
    const raw = localStorage.getItem(`smartstay_student_notifications_${userKey}`);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        const updatedList = list.map((item) => ({ ...item, read: true }));
        localStorage.setItem(`smartstay_student_notifications_${userKey}`, JSON.stringify(updatedList));
        localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updatedList));
      }
    }
  } catch { }

  // Immediately broadcast 0 unread count
  window.dispatchEvent(
    new CustomEvent("smartstay-notifications-updated", {
      detail: { allRead: true, unreadCount: 0 },
    })
  );

  // Asynchronously sync with backend
  try {
    await apiFetch("/payment-notifications/read-all", { method: "PATCH" });
  } catch { }

  return 0;
}

/**
 * Delete a notification
 */
export async function deleteNotificationItem(id, user, backendId, itemObj) {
  const userKey = getPossibleUserKeys(user)[0] || "guest";
  const deletedSet = getDeletedSet(user);
  const strId = String(id);
  deletedSet.add(strId);
  if (backendId) deletedSet.add(String(backendId));
  if (itemObj?.title && itemObj?.message) {
    deletedSet.add(`${itemObj.title.trim()}:${itemObj.message.trim()}`);
  }
  saveDeletedSet(user, deletedSet);

  let newUnreadCount = 0;
  // Update cached student notifications in localStorage
  try {
    const raw = localStorage.getItem(`smartstay_student_notifications_${userKey}`);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        const updatedList = list.filter((item) => {
          const match =
            String(item.id) === strId ||
            (backendId && String(item.backendId) === String(backendId)) ||
            (item.backendId && String(item.backendId) === strId) ||
            (backendId && String(item.id) === String(backendId)) ||
            (itemObj && item.title === itemObj.title && item.message === itemObj.message);
          return !match;
        });
        localStorage.setItem(`smartstay_student_notifications_${userKey}`, JSON.stringify(updatedList));
        localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updatedList));

        const readSet = getReadSet(user);
        newUnreadCount = updatedList.filter((n) => {
          const key = `${n.title?.trim()}:${n.message?.trim()}`;
          const isRead = n.read || readSet.has(String(n.id)) || (n.backendId && readSet.has(String(n.backendId))) || readSet.has(key);
          return !isRead;
        }).length;
      }
    }
  } catch { }

  // Immediately broadcast update
  window.dispatchEvent(
    new CustomEvent("smartstay-notifications-updated", {
      detail: { deletedId: id, backendId, unreadCount: newUnreadCount },
    })
  );

  // Asynchronously sync with backend
  try {
    const targetId = backendId || id;
    await apiFetch(`/payment-notifications/${encodeURIComponent(targetId)}`, {
      method: "DELETE",
    });
  } catch { }

  return newUnreadCount;
}

/**
 * Add a new real notification dynamically (from any page)
 */
export function addRealNotification(notif, user) {
  const userKey = user?._id || user?.id || user?.email || "guest";
  const customList = getCustomNotifs(userKey);

  const newEntry = {
    id: notif.id || `notif-${Date.now()}`,
    title: notif.title || "Notification",
    message: notif.message || "",
    type: notif.type || "room",
    date: notif.date || "Today",
    time:
      notif.time ||
      new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    read: false,
    timestamp: Date.now(),
  };

  const updated = [newEntry, ...customList];
  saveCustomNotifs(userKey, updated);

  window.dispatchEvent(
    new CustomEvent("smartstay-notifications-updated", {
      detail: { newNotif: newEntry },
    })
  );

  return newEntry;
}

/**
 * Compute the unread notification count for the navbar
 */
export function getUnreadNotificationCount(user) {
  try {
    const userRole = user?.role || user?.roleKey;
    if (userRole === "executive" || userRole === "maintenance") {
      const unreadAlerts = localStorage.getItem("smartstay_executive_unread_count");
      if (unreadAlerts !== null) {
        return Math.max(0, Number(unreadAlerts) || 0);
      }
      return 0;
    }

    const readSet = getReadSet(user);
    const deletedSet = getDeletedSet(user);
    const keys = getPossibleUserKeys(user);

    for (const key of keys) {
      const raw = localStorage.getItem(`smartstay_student_notifications_${key}`);
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          return list.filter((n) => {
            const itemKey = `${n.title?.trim()}:${n.message?.trim()}`;
            const isDeleted = deletedSet.has(String(n.id)) || (n.backendId && deletedSet.has(String(n.backendId))) || deletedSet.has(itemKey);
            if (isDeleted) return false;
            const isRead = n.read || readSet.has(String(n.id)) || (n.backendId && readSet.has(String(n.backendId))) || readSet.has(itemKey);
            return !isRead;
          }).length;
        }
      }
    }
    // Fallback to local builder
    const local = buildRealLocalNotifications(user);
    return local.filter((n) => {
      const itemKey = `${n.title?.trim()}:${n.message?.trim()}`;
      const isDeleted = deletedSet.has(String(n.id)) || (n.backendId && deletedSet.has(String(n.backendId))) || deletedSet.has(itemKey);
      if (isDeleted) return false;
      const isRead = n.read || readSet.has(String(n.id)) || (n.backendId && readSet.has(String(n.backendId))) || readSet.has(itemKey);
      return !isRead;
    }).length;
  } catch {
    return 0;
  }
}
