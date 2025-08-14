import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { userSelect } from "../features/user/userSelect";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";

export default function PostsTab() {
  const { currentUser } = useSelector(userSelect);
  const [usersPosts, setUserPosts] = useState([]);
  const [getPostsFailure, setGetPostsFailure] = useState(null);
  const [getPostsLoading, setGetPostsLoaing] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState([]);

  const [errorAlert, setErrorAlert] = useState(null);
  const [successAlert, setSuccessAlert] = useState(null);
  const [deletePostLoading, setDeletePostLoading] = useState(false);

  const [showMore, setShowMore] = useState(true);
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
          if (data.posts.length < 9) setShowMore(true);
        }
      } catch (err) {
        console.error(err);
        setGetPostsFailure(err.message);
      } finally {
        setGetPostsLoaing(false);
      }
    };

    if (currentUser.isAdmin) fetchPosts();
  }, [currentUser._id, successAlert]);

  useEffect(() => {
    if (!selectMode) {
      setSelectedPosts([]);
    }
  }, [selectMode]);

  const handleSelect = (id) => {
    if (!selectMode) return;

    if (selectedPosts.includes(id)) {
      setSelectedPosts((prev) => prev.filter((item) => item !== id));
    }
    if (!selectedPosts.includes(id)) {
      setSelectedPosts((prev) => [...prev, id]);
    }
  };

  const handleShowMore = async () => {
    const startIndex = usersPosts.length;
    try {
      const res = await fetch(
        `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();

      if (!res.ok) {
        return setGetPostsFailure(data.message);
      }

      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (err) {
      console.log(err.message);
      setGetPostsFailure(err.message);
    }
  };

  const handleDelete = async (id) => {
    setDeletePostLoading(true);
    setErrorAlert(null);
    try {
      const res = await fetch(`/api/post/delete/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        return setErrorAlert(data.message);
      }

      if (res.ok) {
        setSuccessAlert(data.message);
      }
    } catch (err) {
      setErrorAlert(err.message);
    } finally {
      setDeletePostLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedPosts.length < 1) return;
    setDeletePostLoading(true);
    setErrorAlert(null);
    try {
      const res = await fetch("/api/post/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postsIds: selectedPosts }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorAlert(data.message);
      }

      if (res.ok) {
        setSuccessAlert(data.message);
        setSelectedPosts([]);
        setSelectMode(false);
      }
    } catch (err) {
      setErrorAlert(err.message);
    } finally {
      setDeletePostLoading(false);
    }
  };

  return (
    <div>
      {usersPosts.length > 0 && (
        <div className="flex gap-2 mb-4 items-center">
          <div className="">
            {!selectMode ? (
              <button
                className="bg-indigo-500 dark:bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-600 dark:hover:bg-indigo-700 transition-colors"
                onClick={() => setSelectMode(true)}
              >
                Выбрать
              </button>
            ) : (
              <button
                className="bg-red-500 dark:bg-red-600 text-white px-4 py-2 rounded hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
                onClick={() =>
                  selectedPosts.length > 0
                    ? handleDeleteSelected()
                    : setSelectMode(false)
                }
              >
                {selectedPosts.length === 0 ? "Отменить" : "Удалить"}
              </button>
            )}
          </div>
          {selectedPosts.length > 0 && selectMode && (
            <p className="font-semibold">Выбрано: {selectedPosts.length}</p>
          )}
        </div>
      )}

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
      {errorAlert && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
          Ошибка при удалении: {errorAlert}
        </div>
      )}

      {successAlert && (
        <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 px-4 py-3 rounded mb-4">
          {successAlert}
        </div>
      )}

      {currentUser.isAdmin && usersPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {usersPosts.map(({ _id, content, image, category, title, slug }) => (
            <div
              onClick={() => handleSelect(_id)}
              key={_id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col border  dark:border-gray-700 ${
                selectedPosts.includes(_id) && selectMode
                  ? " border-blue-500 opacity-[0.7]"
                  : "border-gray-200"
              }`}
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
                <div className="flex items-center justify-between mt-2">
                  <Link
                    to={`/post/${slug}`}
                    className="bg-indigo-500 dark:bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-600 dark:hover:bg-indigo-700 transition-colors text-center"
                  >
                    Подробнее
                  </Link>
                  <button
                    onClick={() => handleDelete(_id)}
                    disabled={deletePostLoading}
                    type="button"
                    className="ml-2 text-red-500 hover:text-red-700 transition-colors p-2 rounded"
                  >
                    <MdDelete size={22} />
                  </button>
                </div>
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

      {showMore && (
        <button
          onClick={handleShowMore}
          className="container bg-indigo-500 mx-auto my-3 rounded-md hover:bg-indigo-600 transition p-2 text-center text-white"
        >
          Показать еще
        </button>
      )}
    </div>
  );
}
