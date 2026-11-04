import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Bell,
  CheckCheck,
  CreditCard,
  ShoppingBag,
  Wrench,
  BedDouble,
  ShieldCheck,
  Trash2,
  RefreshCw,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import {
  fetchUnifiedNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotificationItem,
} from "../../services/notificationService";

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
  security: {
    icon: ShieldCheck,
    bg: "bg-purple-100",
    color: "text-purple-600",
    label: "Security / Gate",
  },
};

function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("All");

  const loadNotifications = useCallback(
    async (isManualRefresh = false) => {
      if (isManualRefresh) setRefreshing(true);
      try {
        const list = await fetchUnifiedNotifications(user);
        setNotifications(list);
      } catch (err) {
        console.warn("Could not load unified notifications:", err);
      } finally {
        setLoading(false);
        if (isManualRefresh) setRefreshing(false);
      }
    },
    [user]
  );

  useEffect(() => {
    loadNotifications();

    const handleSync = () => {
      loadNotifications();
    };

    window.addEventListener("smartstay-notifications-updated", handleSync);
    window.addEventListener("smartstay-complaints-updated", handleSync);
    window.addEventListener("smartstay-food-orders-updated", handleSync);
    window.addEventListener("storage", handleSync);

    return () => {
      window.removeEventListener("smartstay-notifications-updated", handleSync);
      window.removeEventListener("smartstay-complaints-updated", handleSync);
      window.removeEventListener("smartstay-food-orders-updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, [loadNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "Unread") return !notification.read;
    if (filter === "Read") return notification.read;
    return true;
  });

  const handleMarkAsRead = async (id, backendId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    await markNotificationAsRead(id, user, backendId);
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await markAllNotificationsAsRead(notifications, user);
  };

  const handleDelete = async (id, backendId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    await deleteNotificationItem(id, user, backendId);
  };

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
          <p className="mt-1 text-sm text-smart-secondary">
            Live updates on room allocation, complaints, food deliveries, and hostel billing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadNotifications(true)}
            disabled={refreshing}
            title="Refresh notifications"
          >
            <RefreshCw
              size={15}
              className={`mr-1.5 inline ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Syncing..." : "Refresh"}
          </Button>

          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
              <CheckCheck size={17} className="mr-2 inline" />
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
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
        {loading ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <RefreshCw
              size={28}
              className="animate-spin text-smart-blue mb-3"
            />
            <p className="text-sm font-medium text-smart-secondary">
              Loading real notifications...
            </p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-smart-blue/10 text-smart-blue">
              <Bell size={28} />
            </div>

            <h2 className="mt-4 text-lg font-bold text-smart-primary">
              No notifications
            </h2>

            <p className="mt-2 text-sm text-smart-secondary">
              {filter === "Unread"
                ? "You have no unread notifications. You're all caught up!"
                : filter === "Read"
                ? "No read notifications found."
                : "No notifications have been recorded yet."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-black/5">
            {filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRead={handleMarkAsRead}
                onDelete={handleDelete}
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
                <h3 className="font-semibold text-smart-primary">
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
                onClick={() => onRead(notification.id, notification.backendId)}
              >
                <CheckCheck size={15} className="mr-1.5 inline" />
                Mark as read
              </Button>
            )}

            <button
              type="button"
              onClick={() => onDelete(notification.id, notification.backendId)}
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
