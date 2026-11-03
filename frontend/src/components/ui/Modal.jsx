import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

/**
 * Standardized Accessible Modal Component for SmartStay
 * Features: portal to document.body, backdrop blur, size variants, escape key handler,
 * body scroll lock, header, scrollable body, and footer slots.
 */
function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer = null,
  size = "md",
  closeOnEsc = true,
  closeOnOverlay = true,
  showCloseButton = true,
  className = "",
}) {
  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeOnEsc, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-6xl",
  };

  const hasHeaderContent = Boolean(title || subtitle);

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "smartstay-modal-title" : undefined}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
    >
      {/* Full-screen Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={() => closeOnOverlay && onClose?.()}
        aria-hidden="true"
      />

      {/* Modal Dialog Box */}
      <div
        className={`
          relative w-full rounded-2xl bg-white shadow-2xl border border-slate-100
          transition-all duration-200 flex flex-col max-h-[90vh]
          ${sizeClasses[size] || sizeClasses.md}
          ${className}
        `}
      >
        {/* Header - only render header bar if title or subtitle is provided */}
        {hasHeaderContent ? (
          <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
            <div className="min-w-0 flex-1 pr-4">
              {title && (
                <h3
                  id="smartstay-modal-title"
                  className="text-lg font-bold text-smart-primary"
                >
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="mt-0.5 text-xs text-smart-secondary">
                  {subtitle}
                </p>
              )}
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            )}
          </div>
        ) : showCloseButton ? (
          /* Floating close button when no header title exists */
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-4 right-4 z-10 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        ) : null}

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 text-sm text-smart-primary">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-slate-100 bg-slate-50/70 px-6 py-4 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : modalContent;
}

export default Modal;
