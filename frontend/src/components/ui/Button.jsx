function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  isLoading = false,
  ...props
}) {
  const variants = {
    // SmartStay Original Royal Blue Primary
    primary: "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] shadow-sm shadow-blue-500/20",

    // Slate 900 Secondary
    secondary: "bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98] shadow-sm",

    // Clean outline
    outline:
      "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 active:scale-[0.98]",

    teal: "bg-cyan-600 text-white hover:bg-cyan-700 active:scale-[0.98] shadow-sm shadow-cyan-500/20",

    danger: "bg-rose-600 text-white hover:bg-rose-700 active:scale-[0.98] shadow-sm shadow-rose-500/20",

    ghost: "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:scale-[0.98]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-xl font-medium",
    md: "px-4 py-2.5 text-sm rounded-xl font-semibold",
    lg: "px-6 py-3 text-base rounded-2xl font-bold",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center gap-2
        transition-all duration-150 cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-blue-500/30
        ${disabled || isLoading ? "cursor-not-allowed opacity-50" : ""}
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
