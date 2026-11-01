/**
 * Standardized Loading State Component for SmartStay
 * Features: dual-ring spinner with brand colors, customizable message,
 * and support for embedded cards or full-screen overlay.
 */
function LoadingState({
  message = "Loading data...",
  subMessage = "Please wait a moment while we fetch the latest records.",
  fullScreen = false,
  minHeight = "min-h-[260px]",
  size = "md",
  className = "",
}) {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-3",
    lg: "h-14 w-14 border-4",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-xs"
    : `flex flex-col items-center justify-center rounded-2xl bg-white p-8 ${minHeight}`;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`${containerClasses} ${className}`}
    >
      <div className="relative flex items-center justify-center">
        {/* Animated brand spinning ring */}
        <div
          className={`
            animate-spin rounded-full border-solid border-slate-100 border-t-smart-blue border-r-smart-teal
            ${sizeClasses[size] || sizeClasses.md}
          `}
        />
      </div>

      {message && (
        <h4 className="mt-4 text-sm font-semibold text-smart-primary">
          {message}
        </h4>
      )}

      {subMessage && (
        <p className="mt-1 text-xs text-smart-secondary max-w-sm text-center">
          {subMessage}
        </p>
      )}
    </div>
  );
}

export default LoadingState;
