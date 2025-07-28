import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
export default function Search() {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSearch} className="flex mr-4 border border-gray-300">
      <input
        type="text"
        placeholder="Поиск..."
        className=" rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="cursor-pointer px-2 bg-gray-200 text-gray-500">
        <FaSearch />
      </button>
    </form>
  );
}
