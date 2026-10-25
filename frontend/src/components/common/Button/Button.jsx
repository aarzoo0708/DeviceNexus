
const variantClasses = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm",
  secondary:
    "bg-slate-100 hover:bg-slate-200 dark:bg-[#1e293b] dark:hover:bg-[#273449] text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-[#334155]",
  outline:
    "bg-transparent hover:bg-slate-100 dark:hover:bg-[#334155] text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-[#334155]",
  danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-sm",
};

function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
  disabled = false,
  className = "",
  style,
}) {
  const variantClass = variantClasses[variant] || variantClasses.primary;

  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${variantClass} ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
}

export default Button;
