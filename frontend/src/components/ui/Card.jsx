function Card({ children, className = "", padding = "p-5 sm:p-6", hover = false }) {
  return (
    <div
      className={`
        rounded-2xl
        border border-slate-200/80
        bg-white
        shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]
        ${hover ? "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300" : ""}
        ${padding}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default Card;
