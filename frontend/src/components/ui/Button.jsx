function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  ...props
}) {
  const variants = {
    primary: "bg-smart-blue text-white hover:bg-smart-primary",

    secondary: "bg-smart-primary text-white hover:bg-smart-blue",

    outline:
      "border border-smart-primary bg-transparent text-smart-primary hover:bg-smart-primary hover:text-white",

    teal: "bg-smart-teal text-white hover:bg-smart-blue",

    danger: "bg-smart-danger text-white hover:opacity-90",

    ghost: "bg-transparent text-smart-primary hover:bg-smart-background",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      disabled={disabled}
      className={`
        inline-flex items-center justify-center
        rounded-xl font-semibold
        transition duration-200
        focus:outline-none focus:ring-2 focus:ring-smart-blue/40
        ${disabled ? "cursor-not-allowed opacity-50" : "hover:-translate-y-0.5"}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
