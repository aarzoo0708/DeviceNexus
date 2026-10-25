
function Card({ children, className = "", style }) {
  return (
    <div
      className={`min-w-0 panel p-6 shadow-sm ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

export default Card;
