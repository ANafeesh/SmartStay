import { isValidElement } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

/**
 * Standardized Error State Component for SmartStay
 * Features: error icon, title, message, and optional retry action.
 */
function ErrorState({
  title = "Unable to load data",
  message = "An unexpected error occurred while communicating with the server. Please try again.",
  onRetry = null,
  retryText = "Try Again",
  secondaryAction = null,
  minHeight = "min-h-[260px]",
  className = "",
}) {
  return (
    <div
      role="alert"
      className={`
        flex flex-col items-center justify-center rounded-2xl border border-red-100
        bg-red-50/50 p-8 text-center ${minHeight} ${className}
      `}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-smart-danger">
        <AlertCircle size={28} />
      </div>

      <h3 className="mt-4 text-base font-bold text-smart-primary sm:text-lg">
        {title}
      </h3>

      {message && (
        <p className="mt-1.5 max-w-md text-sm text-smart-secondary">
          {message}
        </p>
      )}

      {(onRetry || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-2 rounded-xl bg-smart-danger px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition"
            >
              <RotateCcw size={16} />
              {retryText}
            </button>
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
                {secondaryAction.label}
              </button>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}

export default ErrorState;
