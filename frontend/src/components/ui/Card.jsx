function Card({ children, className = "", padding = "p-6", hover = false }) {
  return (
    <div
      className={`
        rounded-2xl
        border border-black/5
        bg-smart-white
        shadow-sm
        ${hover ? "transition duration-200 hover:-translate-y-1 hover:shadow-md" : ""}
        ${padding}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default Card;
