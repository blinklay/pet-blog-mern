import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Select from "react-select";
const selectOptions = [
  { value: "uncategorized", label: "Без категории" },
  { value: "javascript", label: "JavaScript" },
  { value: "Next.js", label: "next.js" },
  { value: "React.js", label: "react.js" },
];

export default function ProjectsPage() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(true);
  const [posts, setPosts] = useState({
    loading: false,
    error: null,
    data: [],
  });

  useEffect(() => {
    const fetchPosts = async () => {
      setPosts((prev) => ({ ...prev, loading: true }));
      try {
        const res = await fetch(
          `/api/post/getposts?${category ? `category=${category}` : ""}`
        );
        const data = await res.json();
        if (!res.ok) {
          setPosts((prev) => ({ ...prev, error: data.message }));
        }
        if (res.ok) {
          setPosts((prev) => ({ ...prev, data: data.posts }));
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (err) {
        setPosts((prev) => ({ ...prev, error: err.message }));
      } finally {
        setPosts((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchPosts();
  }, [category]);

  const handleShowMore = async () => {
    try {
      const res = await fetch(
        `/api/post/getposts?categoty=${category}&startIndex=${posts.data.length}`
      );
      const data = await res.json();
      if (!res.ok) {
        setPosts((prev) => ({ ...prev, error: data.message }));
      }
      if (res.ok) {
        setPosts((prev) => ({ ...prev, data: [...prev.data, ...data.posts] }));
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (err) {
      setPosts((prev) => ({ ...prev, error: err.message }));
    }
  };

  const handleSelectCategory = (category) => {
    navigate(`/projects?category=${category}`);
  };

  return (
    <div className="w-5xl mx-auto py-5 min-h-screen">
      {posts.loading && (
        <div className="flex justify-center items-center py-10">
          <span className="text-gray-500 dark:text-gray-400">Loading...</span>
        </div>
      )}
      {posts.error && (
        <div className="text-red-500 dark:text-red-400 py-4 text-center">
          {posts.error}
        </div>
      )}
      {!posts.error && !posts.loading && (
        <div className="w-1/2">
          <Select
            onChange={(e) => {
              if (e.value === "uncategorized") {
                handleSelectCategory("");
                return;
              }
              handleSelectCategory(e.value);
            }}
            options={selectOptions}
            defaultValue={[selectOptions[0]]}
            styles={{
              control: (base, state) => ({
                ...base,
                backgroundColor: document.documentElement.classList.contains(
                  "dark"
                )
                  ? "#23272f"
                  : "#f9fafb",
                borderColor: state.isFocused
                  ? "#2563eb"
                  : document.documentElement.classList.contains("dark")
                  ? "#374151"
                  : "#d1d5db",
                boxShadow: state.isFocused ? "0 0 0 2px #2563eb33" : "none",
                color: document.documentElement.classList.contains("dark")
                  ? "#f3f4f6"
                  : "#111827",
                borderRadius: "0.75rem",
                minHeight: "48px",
                fontSize: "1rem",
                transition: "all 0.2s",
                "&:hover": {
                  borderColor: "#2563eb",
                },
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: document.documentElement.classList.contains(
                  "dark"
                )
                  ? "#23272f"
                  : "#fff",
                borderRadius: "0.75rem",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                marginTop: 4,
                zIndex: 20,
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected
                  ? "#2563eb"
                  : state.isFocused
                  ? document.documentElement.classList.contains("dark")
                    ? "#374151"
                    : "#f3f4f6"
                  : "transparent",
                color: state.isSelected
                  ? "#fff"
                  : document.documentElement.classList.contains("dark")
                  ? "#f3f4f6"
                  : "#111827",
                fontWeight: state.isSelected ? "bold" : "normal",
                padding: "12px 20px",
                cursor: "pointer",
                borderRadius: "0.5rem",
                transition: "background 0.2s",
              }),
              singleValue: (base) => ({
                ...base,
                color: document.documentElement.classList.contains("dark")
                  ? "#f3f4f6"
                  : "#111827",
                fontWeight: "bold",
              }),
              input: (base) => ({
                ...base,
                color: document.documentElement.classList.contains("dark")
                  ? "#f3f4f6"
                  : "#111827",
              }),
              placeholder: (base) => ({
                ...base,
                color: "#9ca3af",
                fontStyle: "italic",
              }),
              dropdownIndicator: (base, state) => ({
                ...base,
                color: state.isFocused ? "#2563eb" : "#9ca3af",
                "&:hover": {
                  color: "#2563eb",
                },
              }),
              indicatorSeparator: (base) => ({
                ...base,
                backgroundColor: "#e5e7eb",
              }),
            }}
          />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
        {posts.data.map((post) => (
          <div
            key={post._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col"
          >
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4 flex-1 flex flex-col">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
                {post.category}
              </span>
              <Link
                to={`/post/${post.slug}`}
                className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2"
              >
                {post.title}
              </Link>
              <div
                className="text-gray-700 dark:text-gray-300 text-sm"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </div>
        ))}
      </div>
      {showMore && posts.data.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={handleShowMore}
            disabled={posts.loading}
          >
            {posts.loading ? "Загрузка..." : "Загрузить еще"}
          </button>
        </div>
      )}
    </div>
  );
}
