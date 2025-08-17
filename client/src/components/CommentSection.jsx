import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { userSelect } from "../features/user/userSelect";
import TextEditor from "./RichTextEditor";

export default function CommentSection() {
  const { postSlug } = useParams();
  const [comments, setComments] = useState([]);
  const [getCommentsFailure, setGetCommentsFailure] = useState(null);
  const [getCommentsLoading, setGetCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const { currentUser } = useSelector(userSelect);

  const [createCommentFailure, setCreateCommentFailure] = useState(null);
  const [createCommentLoading, setCreateCommentLoading] = useState(false);

  const [delteCommentFailure, setDelteCommentFailure] = useState(null);
  const [delteCommentLoading, setDelteCommentLoading] = useState(false);
  useEffect(() => {
    const loadComment = async () => {
      setGetCommentsLoading(true);
      setGetCommentsLoading(null);
      try {
        const res = await fetch(`/api/post/getpost/${postSlug}`);
        const data = await res.json();

        if (!res.ok) {
          return setGetCommentsFailure(data.message);
        }

        if (res.ok) {
          return setComments(data.post.comments);
        }
      } catch (err) {
        setGetCommentsFailure(err.message);
      } finally {
        setGetCommentsLoading(false);
      }
    };

    loadComment();
  }, []);

  const addComment = async (e) => {
    e.preventDefault();
    if (newComment.length === 0) return;
    setCreateCommentLoading(true);
    setCreateCommentFailure(null);
    try {
      const res = await fetch(`/api/post/${postSlug}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: newComment,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCreateCommentFailure(data.message);
      }
      if (res.ok) {
        setComments((prev) => [...prev, data]);
      }
    } catch (err) {
      setCreateCommentFailure(err.message);
    } finally {
      setCreateCommentLoading(false);
    }
  };

  const deleteComment = async (commentId) => {
    setDelteCommentFailure(null);
    setDelteCommentLoading(true);

    try {
      const res = await fetch(`/api/post/${postSlug}/comment/${commentId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        setDelteCommentFailure(data.message);
      }
      if (res.ok) {
        setComments((prev) => prev.filter((item) => item._id !== commentId));
      }
    } catch (err) {
      setDelteCommentFailure(err.message);
    } finally {
      setDelteCommentLoading(false);
    }
  };

  return (
    <div className="mt-auto">
      <h2 className="font-semibold">Комментарии:</h2>
      <div>
        {createCommentFailure && (
          <div className="bg-red-200 p-3 text-md mt-4 rounded-md">
            <span className="font-semibold text-md">Ошибка:</span>
            <p>{createCommentFailure}</p>
          </div>
        )}
        {delteCommentFailure && (
          <div className="bg-red-200 p-3 text-md mt-4 rounded-md">
            <span className="font-semibold text-md">Ошибка:</span>
            <p>{delteCommentFailure}</p>
          </div>
        )}
        {currentUser && (
          <form onSubmit={addComment}>
            <TextEditor content={newComment} onChange={setNewComment} />
            <button
              disabled={createCommentLoading}
              className="bg-indigo-500 text-white p-2 rounded-md mt-2 hover:bg-indigo-600 transition disabled:opacity-[0.5]"
            >
              {createCommentLoading ? "Загрузка..." : "Добавить комментарий"}
            </button>
          </form>
        )}
      </div>
      <div>
        {getCommentsLoading && <p>Загрузка комментариев...</p>}
        {getCommentsFailure && (
          <p className="text-red-500">{getCommentsFailure}</p>
        )}
        {comments.length === 0 && !getCommentsLoading && (
          <p>Нет комментариев.</p>
        )}
        {comments.map((c) => (
          <div
            key={c._id}
            className="border-b py-2 flex items-start gap-3 mt-2"
          >
            <img
              src={c.author?.profilePicture || "/default-profile.png"}
              alt={c.author?.username}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <div className="font-medium">
                {c.author?.username || "Аноним"}
              </div>
              <div
                className="prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: c.text }}
              />
              <div className="text-xs text-gray-400">
                {new Date(c.createdAt).toLocaleString()}
              </div>
            </div>
            {currentUser?._id === c.author._id && (
              <button
                disabled={delteCommentLoading}
                onClick={() => deleteComment(c._id)}
                className="ml-auto bg-red-500 p-2 text-sm text-white hover:bg-red-600 transition rounded-md disabled:opacity-[0.5]"
              >
                {delteCommentLoading ? "Загрузка..." : "Удалить"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
