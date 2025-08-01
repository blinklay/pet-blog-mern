import React from "react";
import { Link } from "react-router-dom";
import Search from "./Search";
import Navigation from "./Navigation";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Header() {
  return (
    <header
      className={`bg-white border-b border-gray-200 dark:border-zinc-800 dark:bg-zinc-600 dark:text-white`}
    >
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-xl font-semibold text-gray-900 dark:text-white"
        >
          MyBlog
        </Link>
        <Search />
        <Navigation />
        <ThemeSwitcher />
      </div>
    </header>
  );
}
