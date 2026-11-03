function Badge({ children, variant = "success", className = "" }) {
  const variants = {
    success: "bg-emerald-50 text-emerald-800 border border-emerald-200/90 font-semibold",
    warning: "bg-amber-50 text-amber-900 border border-amber-300/80 font-semibold",
    danger: "bg-rose-50 text-rose-800 border border-rose-200/90 font-semibold",
    info: "bg-blue-50 text-blue-800 border border-blue-200/90 font-semibold",
    teal: "bg-cyan-50 text-cyan-900 border border-cyan-200/90 font-semibold",
    neutral: "bg-slate-100 text-slate-800 border border-slate-200 font-semibold",
  };

  return (
    <span
      className={`
        inline-flex items-center
        rounded-full
        px-2.5 py-0.5
        text-xs font-semibold
        ${variants[variant] || variants.neutral}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

export default Badge;
