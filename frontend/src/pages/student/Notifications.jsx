import { useState, useEffect } from "react";
import { useAuth, isDemoUser } from "../../context/AuthContext";
import {
  Bell,
  CheckCheck,
  CreditCard,
  ShoppingBag,
  Wrench,
  BedDouble,
  Trash2,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

const initialNotifications = [
  {
    id: 1,
    title: "Payment Received",
    message:
      "Your Utility Charge payment of Rs. 2,500 was received successfully.",
    date: "20 Sep 2026",
    time: "10:30 AM",
    type: "payment",
    read: true,
  },
  {
    id: 2,
    title: "Complaint Updated",
    message:
      "Your room light complaint has been assigned to the maintenance team.",
    date: "20 Sep 2026",
    time: "09:15 AM",
    type: "maintenance",
    read: false,
  },
  {
    id: 3,
    title: "Food Order Ready",
    message: "Your order #ORD-1023 is ready for collection.",
    date: "19 Sep 2026",
    time: "01:20 PM",
    type: "food",
    read: false,
  },
  {
    id: 4,
    title: "Room Allocation Confirmed",
    message:
      "Your room B-204 allocation has been confirmed for the 2026 academic year.",
    date: "05 Jan 2026",
    time: "08:45 AM",
    type: "room",
    read: true,
  },
  {
    id: 5,
    title: "Maintenance Request Resolved",
    message: "Your study table repair request has been successfully completed.",
    date: "18 Sep 2026",
    time: "04:10 PM",
    type: "maintenance",
    read: true,
  },
  {
    id: 6,
    title: "Payment Reminder",
    message: "Your September Hostel Fee of Rs. 8,000 is still pending.",
    date: "17 Sep 2026",
    time: "09:00 AM",
    type: "payment",
    read: false,
  },
];

const notificationConfig = {
  payment: {
    icon: CreditCard,
    bg: "bg-smart-blue/10",
    color: "text-smart-blue",
    label: "Payment",
  },
  maintenance: {
    icon: Wrench,
    bg: "bg-smart-warning/10",
    color: "text-smart-warning",
    label: "Maintenance",
  },
  food: {
    icon: ShoppingBag,
    bg: "bg-smart-teal/10",
    color: "text-smart-teal",
    label: "Food Order",
  },
  room: {
    icon: BedDouble,
    bg: "bg-smart-success/10",
    color: "text-smart-success",
    label: "Room",
  },
};

const NOTIFICATIONS_STORAGE_KEY = "smartstay_student_notifications";

export function readStoredNotifications() {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return initialNotifications;
}

export function saveNotifications(list) {
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("smartstay-notifications-updated", { detail: list }));
  } catch {}
}

function Notifications() {
  const { user } = useAuth();
  const isDemo = isDemoUser(user) || user?.isDemo || user?.email === "nafeesh@campus.edu";
  const userKey = user?._id || user?.id || user?.email || "guest";
  const storageKey = isDemo ? NOTIFICATIONS_STORAGE_KEY : `smartstay_student_notifications_${userKey}`;

  const getInitialNotifs = () => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) return JSON.parse(raw);
    } catch {}
    if (isDemo) return initialNotifications;
    return [
      {
        id: 1,
        title: "Welcome to SmartStay",
        message: `Welcome ${user?.name || "Student"}! Your SmartStay hostel account is now active.`,
        date: "Today",
        time: "Just now",
        type: "room",
        read: false,
      },
    ];
  };

  const [notifications, setNotifications] = useState(getInitialNotifs);

  useEffect(() => {
    const handleSync = () => setNotifications(getInitialNotifs());
    window.addEventListener("smartstay-notifications-updated", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("smartstay-notifications-updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, [storageKey]);

  const saveNotifications = (newList) => {
    setNotifications(newList);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newList));
      window.dispatchEvent(new CustomEvent("smartstay-notifications-updated", { detail: newList }));
    } catch {}
  };

  const [filter, setFilter] = useState("All");

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "Unread") {
      return !notification.read;
    }

    if (filter === "Read") {
      return notification.read;
    }

    return true;
  });

  function markAsRead(id) {
    setNotifications((previous) => {
      const updated = previous.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      );
      saveNotifications(updated);
      return updated;
    });
  }

  function markAllAsRead() {
    setNotifications((previous) => {
      const updated = previous.map((notification) => ({
        ...notification,
        read: true,
      }));
      saveNotifications(updated);
      return updated;
    });
  }

  function deleteNotification(id) {
    setNotifications((previous) => {
      const updated = previous.filter((notification) => notification.id !== id);
      saveNotifications(updated);
      return updated;
    });
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-smart-primary">
              Notifications
            </h1>

            {unreadCount > 0 && (
              <span className="rounded-full bg-smart-danger px-2.5 py-1 text-xs font-bold text-white">
                {unreadCount} new
              </span>
            )}
          </div>

          
        </div>

        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCheck size={17} className="mr-2 inline" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Summary */}
      <div className="grid gap-5 sm:grid-cols-3">
        <SummaryCard
          title="All Notifications"
          value={notifications.length}
          icon={Bell}
          color="text-smart-blue"
          bg="bg-smart-blue/10"
        />

        <SummaryCard
          title="Unread"
          value={unreadCount}
          icon={Bell}
          color="text-smart-danger"
          bg="bg-smart-danger/10"
        />

        <SummaryCard
          title="Read"
          value={notifications.length - unreadCount}
          icon={CheckCheck}
          color="text-smart-success"
          bg="bg-smart-success/10"
        />
      </div>

      {/* Filters */}
      <Card className="mt-6 p-3">
        <div className="flex flex-wrap gap-2">
          {["All", "Unread", "Read"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                filter === item
                  ? "bg-smart-primary text-white"
                  : "text-smart-secondary hover:bg-smart-background"
              }`}
            >
              {item}
              {item === "Unread" && unreadCount > 0 && (
                <span className="ml-2">({unreadCount})</span>
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* Notification List */}
      <Card className="mt-6 p-0 overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-smart-blue/10 text-smart-blue">
              <Bell size={28} />
            </div>

            <h2 className="mt-4 text-lg font-bold text-smart-primary">
              No notifications
            </h2>

            <p className="mt-2 text-sm text-smart-secondary">
              You're all caught up.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-black/5">
            {filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRead={markAsRead}
                onDelete={deleteNotification}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function SummaryCard({ title, value, icon: Icon, color, bg }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${bg} ${color}`}
        >
          <Icon size={24} />
        </div>

        <p className="text-3xl font-bold text-smart-primary">{value}</p>
      </div>

      <p className="mt-4 text-sm font-medium text-smart-secondary">{title}</p>
    </div>
  );
}

function NotificationItem({ notification, onRead, onDelete }) {
  const config =
    notificationConfig[notification.type] || notificationConfig.room;

  const Icon = config.icon;

  return (
    <div
      className={`p-5 transition ${
        notification.read ? "bg-white" : "bg-smart-blue/[0.03]"
      }`}
    >
      <div className="flex gap-4">
        {/* Icon */}
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${config.bg} ${config.color}`}
        >
          <Icon size={22} />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  className={`font-semibold ${
                    notification.read
                      ? "text-smart-primary"
                      : "text-smart-primary"
                  }`}
                >
                  {notification.title}
                </h3>

                {!notification.read && (
                  <span className="h-2 w-2 rounded-full bg-smart-blue" />
                )}
              </div>

              <p className="mt-1 text-xs text-smart-secondary">
                {config.label}
              </p>
            </div>

            <p className="shrink-0 text-xs text-smart-secondary">
              {notification.date} · {notification.time}
            </p>
          </div>

          <p className="mt-3 text-sm leading-6 text-smart-secondary">
            {notification.message}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {!notification.read && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRead(notification.id)}
              >
                <CheckCheck size={15} className="mr-1.5 inline" />
                Mark as read
              </Button>
            )}

            <button
              type="button"
              onClick={() => onDelete(notification.id)}
              className="rounded-xl px-3 py-2 text-xs font-semibold text-smart-danger transition hover:bg-smart-danger/10"
            >
              <Trash2 size={15} className="mr-1.5 inline" />
              Delete
            </button>

            {notification.read && <Badge variant="success">Read</Badge>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
