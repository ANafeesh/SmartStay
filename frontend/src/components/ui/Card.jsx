function Card({ children, className = "", padding = "p-6" }) {
  return (
    <div
      className={`rounded-2xl border border-black/5 bg-smart-white ${padding} shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
