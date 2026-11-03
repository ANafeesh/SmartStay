/**
 * Standardized Status Badge Component for SmartStay
 * Automatically maps standard hostel/system statuses (e.g. Paid, Available, Occupied,
 * Pending, Resolved, Critical) to appropriate theme colors with an optional dot indicator.
 */
function StatusBadge({
  status = "",
  variant = null,
  showDot = true,
  size = "md",
  className = "",
  children = null,
}) {
  const normalized = (status || "").toString().toLowerCase().trim();

  // Determine variant automatically if not explicitly provided
  const computedVariant =
    variant ||
    (() => {
      switch (normalized) {
        // Success (Green)
        case "available":
        case "active":
        case "paid":
        case "resolved":
        case "completed":
        case "approved":
        case "operational":
        case "delivered":
        case "pass":
        case "normal":
        case "success":
          return "success";

        // Warning (Amber / Yellow)
        case "pending":
        case "in progress":
        case "in-progress":
        case "maintenance":
        case "warning":
        case "preparing":
        case "partially paid":
        case "partially-paid":
        case "partial":
        case "expiring soon":
        case "due":
          return "warning";

        // Danger (Red)
        case "occupied":
        case "rejected":
        case "overdue":
        case "critical":
        case "failed":
        case "cancelled":
        case "emergency":
        case "inactive":
        case "out of order":
        case "blocked":
        case "high":
        case "danger":
          return "danger";

        // Info (Blue)
        case "assigned":
        case "placed":
        case "reserved":
        case "info":
        case "new":
        case "submitted":
        case "open":
        case "low":
          return "info";

        // Teal (Cyan)
        case "ready":
        case "verified":
        case "inspected":
        case "under review":
        case "medium":
          return "teal";

        // Neutral (Slate / Gray)
        default:
          return "neutral";
      }
    })();

  const variantStyles = {
    success: {
      badge: "bg-emerald-50 text-emerald-800 font-semibold border-emerald-200/60",
      dot: "bg-emerald-500",
    },
    warning: {
      badge: "bg-amber-50 text-amber-900 font-semibold border-amber-200/60",
      dot: "bg-amber-500",
    },
    danger: {
      badge: "bg-rose-50 text-rose-800 font-semibold border-rose-200/60",
      dot: "bg-rose-500",
    },
    info: {
      badge: "bg-blue-50 text-blue-800 font-semibold border-blue-200/60",
      dot: "bg-blue-500",
    },
    teal: {
      badge: "bg-cyan-50 text-cyan-900 font-semibold border-cyan-200/60",
      dot: "bg-cyan-500",
    },
    neutral: {
      badge: "bg-slate-100 text-slate-800 font-semibold border-slate-200",
      dot: "bg-slate-400",
    },
  };

  const currentStyle = variantStyles[computedVariant] || variantStyles.neutral;

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
  };

  const displayText = children || status;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border font-medium tracking-wide
        ${currentStyle.badge}
        ${sizeStyles[size] || sizeStyles.md}
        ${className}
      `}
    >
      {showDot && (
        <span
          className={`h-1.5 w-1.5 rounded-full shrink-0 ${currentStyle.dot}`}
          aria-hidden="true"
        />
      )}
      <span>{displayText}</span>
    </span>
  );
}

export default StatusBadge;
