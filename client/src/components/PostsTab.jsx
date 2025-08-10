import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { userSelect } from "../features/user/userSelect";
import { Link } from "react-router-dom";

export default function PostsTab() {
  const { currentUser } = useSelector(userSelect);
  const [usersPosts, setUserPosts] = useState([]);
  const [getPostsFailure, setGetPostsFailure] = useState(null);
  const [getPostsLoading, setGetPostsLoaing] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setGetPostsLoaing(true);
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
        }
        if (res.ok) {
          setUserPosts(data.posts);
        }
      } catch (err) {
        console.error(err);
        setGetPostsFailure(err.message);
      } finally {
        setGetPostsLoaing(false);
      }
    };

    if (currentUser.isAdmin) fetchPosts();
  }, [currentUser._id]);

  return (
    <div>
      {getPostsLoading && (
        <div className="flex justify-center items-center py-10">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {getPostsFailure && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
          Ошибка при получении данных: {getPostsFailure}
        </div>
      )}

      {currentUser.isAdmin && usersPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {usersPosts.map(({ _id, content, image, category, title, slug }) => (
            <div
              key={_id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col border border-gray-200 dark:border-gray-700"
            >
              {image && (
                <img
                  src={image}
                  alt={title}
                  className="h-48 w-full object-cover"
                />
              )}
              <div className="p-4 flex-1 flex flex-col">
                <span className="text-xs text-indigo-500 dark:text-indigo-300 uppercase font-semibold mb-2">
                  {category}
                </span>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 line-clamp-2">
                  {title}
                </h2>
                <div
                  className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 flex-1"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
                <Link
                  to={`/posts/${slug}`}
                  className="mt-auto bg-indigo-500 dark:bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-600 dark:hover:bg-indigo-700 transition-colors text-center"
                >
                  Подробнее
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !getPostsLoading && (
          <div className="container mx-auto p-4 text-center text-gray-500 dark:text-gray-400">
            Ваш список постов пуст...
          </div>
        )
      )}
    </div>
  );
}
