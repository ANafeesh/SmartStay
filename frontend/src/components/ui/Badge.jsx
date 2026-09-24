function Badge({ children, variant = "success" }) {
  const variants = {
    success: "bg-smart-success/10 text-smart-success",

    warning: "bg-smart-warning/10 text-smart-warning",

    danger: "bg-smart-danger/10 text-smart-danger",

    info: "bg-smart-blue/10 text-smart-blue",

    teal: "bg-smart-teal/10 text-smart-teal",

    neutral: "bg-smart-secondary/10 text-smart-secondary",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${variants[variant]}`}
    >
      {children}
    </span>
  );
}

export default Badge;
