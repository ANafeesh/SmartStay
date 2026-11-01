import { forwardRef } from "react";
import { ChevronDown, AlertCircle } from "lucide-react";

/**
 * Standardized Select Dropdown Component for SmartStay
 * Supports options array or direct <option> children, left icon,
 * custom chevron indicator, validation error message, and helper text.
 */
const SelectField = forwardRef(function SelectField(
  {
    label,
    id,
    name,
    value,
    defaultValue,
    onChange,
    options = [],
    placeholder,
    error,
    helperText,
    required = false,
    disabled = false,
    icon: Icon = null,
    className = "",
    selectClassName = "",
    children,
    ...props
  },
  ref
) {
  const selectId = id || name || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
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

        <select
          ref={ref}
          id={selectId}
          name={name}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
          className={`
            w-full appearance-none rounded-xl border bg-white px-3.5 py-2.5 pr-10 text-sm text-smart-primary
            transition duration-150
            focus:outline-none focus:ring-2 focus:ring-smart-blue/20
            ${Icon ? "pl-10" : ""}
            ${
              error
                ? "border-smart-danger focus:border-smart-danger focus:ring-smart-danger/20"
                : "border-slate-200 hover:border-slate-300 focus:border-smart-blue"
            }
            ${disabled ? "cursor-not-allowed bg-slate-50 text-slate-400" : ""}
            ${selectClassName}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {children
            ? children
            : options.map((opt) => {
                const optVal = typeof opt === "object" ? opt.value : opt;
                const optLabel = typeof opt === "object" ? opt.label : opt;
                const optDisabled = typeof opt === "object" ? opt.disabled : false;
                return (
                  <option key={optVal} value={optVal} disabled={optDisabled}>
                    {optLabel}
                  </option>
                );
              })}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
          <ChevronDown size={18} />
        </div>
      </div>

      {error ? (
        <p id={`${selectId}-error`} className="mt-1.5 flex items-center gap-1 text-xs text-smart-danger">
          <AlertCircle size={13} className="shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p id={`${selectId}-helper`} className="mt-1.5 text-xs text-smart-secondary">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

export default SelectField;
