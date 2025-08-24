import React from "react";
import { Link } from "react-router-dom";
export default function HomePage() {
  const categories = ["javascript", "React.js", "Next.js", "Express.js"];

  return (
    <section className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to the Blog
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Discover articles, tutorials, and insights.
        </p>
        <Link
          to={"/sign-in"}
          className="px-6 py-2 rounded bg-blue-600 text-white dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 transition"
        >
          Get Started
        </Link>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Categories
          </h2>
          <ul className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <li
                key={category}
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <Link to={`/projects?category=${category}`}>{category}</Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Advantages Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Advantages
          </h2>
          <ul className="flex flex-col items-center gap-3">
            <li className="px-6 py-3 rounded bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 w-fit">
              Up-to-date content on modern web technologies
            </li>
            <li className="px-6 py-3 rounded bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 w-fit">
              Easy navigation by categories
            </li>
            <li className="px-6 py-3 rounded bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 w-fit">
              Community-driven articles and tutorials
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
