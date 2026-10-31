import { forwardRef, useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

/**
 * Standardized Input Field Component for SmartStay
 * Supports text, number, email, search, password (with show/hide toggle),
 * left icons, error states, and helper text.
 */
const InputField = forwardRef(function InputField(
  {
    label,
    id,
    name,
    type = "text",
    value,
    defaultValue,
    onChange,
    placeholder,
    error,
    helperText,
    required = false,
    disabled = false,
    readOnly = false,
    icon: Icon = null,
    rightIcon = null,
    className = "",
    inputClassName = "",
    ...props
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || name || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  const isPassword = type === "password";
  const effectiveType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-smart-primary"
        >
          {label}
          {required && <span className="ml-1 text-smart-danger">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Icon size={18} />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          name={name}
          type={effectiveType}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          className={`
            w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-smart-primary
            transition duration-150 placeholder:text-slate-400
            focus:outline-none focus:ring-2 focus:ring-smart-blue/20
            ${Icon ? "pl-10" : ""}
            ${isPassword || rightIcon ? "pr-10" : ""}
            ${
              error
                ? "border-smart-danger focus:border-smart-danger focus:ring-smart-danger/20"
                : "border-slate-200 hover:border-slate-300 focus:border-smart-blue"
            }
            ${disabled ? "cursor-not-allowed bg-slate-50 text-slate-400" : ""}
            ${readOnly ? "bg-slate-50/70" : ""}
            ${inputClassName}
          `}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

        {!isPassword && rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
            {rightIcon}
          </div>
        )}
      </div>

      {error ? (
        <p id={`${inputId}-error`} className="mt-1.5 flex items-center gap-1 text-xs text-smart-danger">
          <AlertCircle size={13} className="shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p id={`${inputId}-helper`} className="mt-1.5 text-xs text-smart-secondary">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

export default InputField;
