import { isValidElement } from "react";
import { Inbox } from "lucide-react";

/**
 * Standardized Empty State Component for SmartStay
 * Displays an icon, title, description, and optional action button.
 * Preserves 100% backward compatibility with all existing props.
 */
function EmptyState({
  title = "No data available",
  description = "There is nothing to display here yet.",
  icon: Icon = Inbox,
  action = null,
  secondaryAction = null,
  className = "",
}) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center rounded-2xl border border-dashed
        border-slate-200 bg-white px-6 py-12 text-center
        ${className}
      `}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-smart-blue/10 text-smart-blue">
        <Icon size={26} />
      </div>

      <h3 className="mt-4 text-base font-bold text-smart-primary sm:text-lg">
        {title}
      </h3>

      {description && (
        <p className="mt-1.5 max-w-md text-sm text-smart-secondary">
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {action && (
            typeof action === "function" ? (
              <button
                type="button"
                onClick={action}
                className="inline-flex items-center gap-2 rounded-xl bg-smart-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-smart-primary transition"
              >
                Take Action
              </button>
            ) : isValidElement(action) ? (
              action
            ) : action.label ? (
              <button
                type="button"
                onClick={action.onClick}
                className="inline-flex items-center gap-2 rounded-xl bg-smart-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-smart-primary transition"
              >
                {action.icon && <action.icon size={16} />}
                {action.label}
              </button>
            ) : null
          )}

          {secondaryAction && (
            isValidElement(secondaryAction) ? (
              secondaryAction
            ) : secondaryAction.label ? (
              <button
                type="button"
                onClick={secondaryAction.onClick}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-smart-primary hover:bg-slate-50 transition"
              >
                {secondaryAction.icon && <secondaryAction.icon size={16} />}
                {secondaryAction.label}
              </button>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}

export default EmptyState;
