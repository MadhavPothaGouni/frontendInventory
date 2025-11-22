// src/components/SearchBar.js
import React, { useState } from "react";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // live search
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch(query);
    }
  };

  return (
    <input
      type="text"
      className="form-control"
      placeholder="Search product..."
      value={query}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  );
}

export default SearchBar;
