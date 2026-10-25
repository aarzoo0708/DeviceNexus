import { FiSearch } from "react-icons/fi";

function SearchInput({
  value = "",
  onChange,
  placeholder = "Search...",
  className = "",
}) {
  return (
    <div
      className={`relative flex items-center w-full bg-white dark:bg-[#1e293b] border border-slate-300 dark:border-[#334155] rounded-xl px-4 py-2.5 text-slate-800 dark:text-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-900/40 transition-all ${className}`}
    >
      <FiSearch className="shrink-0 text-slate-400 mr-2.5" size={18} />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={placeholder}
        className="min-w-0 w-full bg-transparent border-none outline-none text-sm placeholder-slate-400 text-slate-900 dark:text-slate-100"
      />
    </div>
  );
}

export default SearchInput;
