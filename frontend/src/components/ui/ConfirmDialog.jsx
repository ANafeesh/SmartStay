import Modal from "./Modal";
import { AlertTriangle, AlertCircle, Info, CheckCircle2, Loader2 } from "lucide-react";

/**
 * Standardized Confirmation Dialog for SmartStay
 * Ideal for delete confirmations, irreversible status changes, and critical actions.
 */
function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  isLoading = false,
}) {
  const typeConfigs = {
    danger: {
      icon: AlertTriangle,
      iconBg: "bg-rose-100 text-rose-600",
      buttonBg: "bg-rose-600 hover:bg-rose-700 text-white",
    },
    warning: {
      icon: AlertCircle,
      iconBg: "bg-amber-100 text-amber-600",
      buttonBg: "bg-amber-600 hover:bg-amber-700 text-white",
    },
    info: {
      icon: Info,
      iconBg: "bg-blue-100 text-smart-blue",
      buttonBg: "bg-smart-blue hover:bg-smart-primary text-white",
    },
    success: {
      icon: CheckCircle2,
      iconBg: "bg-emerald-100 text-emerald-600",
      buttonBg: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
  };

  const config = typeConfigs[type] || typeConfigs.danger;
  const IconComponent = config.icon;

  const footer = (
    <div className="flex items-center justify-end gap-3">
      <button
        type="button"
        disabled={isLoading}
        onClick={onClose}
        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-smart-primary hover:bg-slate-50 transition disabled:opacity-50 cursor-pointer"
      >
        {cancelText}
      </button>

      <button
        type="button"
        disabled={isLoading}
        onClick={onConfirm}
        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold shadow-xs transition disabled:opacity-50 cursor-pointer ${config.buttonBg}`}
      >
        {isLoading && <Loader2 size={14} className="animate-spin" />}
        <span>{confirmText}</span>
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={!isLoading}
      closeOnEsc={!isLoading}
      closeOnOverlay={!isLoading}
      footer={footer}
    >
      <div className="flex items-start gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${config.iconBg}`}>
          <IconComponent size={24} />
        </div>

        <div className="flex-1 pr-6">
          <h4 className="text-base font-bold text-smart-primary">
            {title}
          </h4>
          <div className="mt-1.5 text-xs text-smart-secondary leading-relaxed">
            {message}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
