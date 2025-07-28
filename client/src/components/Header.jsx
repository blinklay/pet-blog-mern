import React from "react";
import { Link } from "react-router-dom";
import Search from "./Search";
import Navigation from "./Navigation";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold text-gray-900">
          MyBlog
        </Link>
        <Search />
        <Navigation />
      </div>
    </header>
  );
}
