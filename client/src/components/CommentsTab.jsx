import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { userSelect } from "../features/user/userSelect";

export default function CommentsTab() {
  const [comments, setComments] = useState({
    loading: false,
    error: null,
    data: [],
  });
  const [showMore, setShowMore] = useState(true);
  const { currentUser } = useSelector(userSelect);

  useEffect(() => {
    const fetchComments = async () => {
      setComments((prev) => ({
        ...prev,
        laoding: true,
      }));
      try {
        const res = await fetch(
          `api/comment/getAllComments?userId=${currentUser._id}`
        );
        const data = await res.json();
        if (!res.ok) {
          setComments((prev) => ({
            ...prev,
            error: data.message,
          }));
        }
        if (res.ok) {
          setComments((prev) => ({
            ...prev,
            data: data.comments,
          }));
          if (data.comments.length < 10) {
            setShowMore(false);
          }
        }
      } catch (err) {
        setComments((prev) => ({
          ...prev,
          error: err.message,
        }));
      } finally {
        setComments((prev) => ({
          ...prev,
          laoding: false,
        }));
      }
    };

    fetchComments();
  }, []);

  const handleShowMore = async () => {
    try {
      const res = await fetch(
        `api/comment/getAllComments?userId=${currentUser._id}&startIndex=${comments.data.length}`
      );
      const data = await res.json();
      if (!res.ok) {
        setComments((prev) => ({
          ...prev,
          error: data.message,
        }));
      }
      if (res.ok) {
        setComments((prev) => {
          return { data: [...prev.data, ...data.comments] };
        });
        if (data.comments.length < 10) {
          setShowMore(false);
        }
      }
    } catch (err) {
      console.log(err);

      setComments((prev) => ({
        ...prev,
        error: err.message,
      }));
    }
  };

  const handleDeleteComment = async (commentId, postSlug) => {
    setComments((prev) => ({ ...prev, loading: true }));
    setComments((prev) => ({ ...prev, error: null }));
    try {
      const res = await fetch(`/api/post/${postSlug}/comment/${commentId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        setComments((prev) => ({ ...prev, error: data.message }));
      }
      if (res.ok) {
        setComments((prev) => ({
          ...prev,
          data: prev.data.filter((c) => c._id !== commentId),
        }));
      }
    } catch (err) {
      setComments((prev) => ({ ...prev, error: err.message }));
    } finally {
      setComments((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <div>
      {comments.loading && (
        <div className="flex justify-center items-center py-4">
          <span className="text-gray-500 dark:text-gray-400">
            Loading comments...
          </span>
        </div>
      )}
      {comments.error && (
        <div className="text-red-500 dark:text-red-400 py-2">
          {comments.error}
        </div>
      )}
      {comments.data && comments.data.length > 0 ? (
        <ul className="space-y-4">
          {comments.data.map((comment) => (
            <li
              key={comment._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex gap-4"
            >
              <img
                src={comment.author?.profilePicture}
                alt={comment.author?.username}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {comment.author?.username}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <div
                  className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300"
                  dangerouslySetInnerHTML={{ __html: comment.text }}
                />
              </div>
              <button
                onClick={() =>
                  handleDeleteComment(comment._id, comment.postId?.slug)
                }
                className="text-red-400 hover:text-red-500 transition"
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>
      ) : (
        !comments.loading && (
          <div className="text-gray-500 dark:text-gray-400 py-4">
            No comments found.
          </div>
        )
      )}
      {showMore && (
        <button
          onClick={handleShowMore}
          className="container bg-indigo-500 dark:bg-indigo-700 mx-auto my-3 rounded-md hover:bg-indigo-600 dark:hover:bg-indigo-800 transition p-2 text-center text-white"
        >
          Показать еще
        </button>
      )}
    </div>
  );
}
