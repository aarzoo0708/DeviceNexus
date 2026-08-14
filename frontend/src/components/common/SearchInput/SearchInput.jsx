import "./SearchInput.css";

function SearchInput({
  value = "",
  onChange,
  placeholder = "Search...",
}) {
  return (
    <div className="search-input">
      <span className="search-input-icon">
        ⌕
      </span>

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

export default SearchInput;