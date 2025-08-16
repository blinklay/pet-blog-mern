import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { userSelect } from "../features/user/userSelect";
import TextEditor from "../components/RichTextEditor";
import CommentSection from "../components/CommentSection";
export default function SinglePostPage() {
  const { postSlug } = useParams();
  const [post, setPost] = useState(null);
  const [getPostLoading, setGetPostLoading] = useState(false);
  const [getPostFailure, setGetPostFailure] = useState(null);
  const { currentUser } = useSelector(userSelect);
  const [isOwner, setIsOwner] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postLoading, setPostLoading] = useState(false);
  const [postFailure, setPostFailure] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const loadPost = async () => {
      setGetPostFailure(null);
      setGetPostLoading(true);
      try {
        const res = await fetch(`/api/post/getpost/${postSlug}`);
        const data = await res.json();

        if (!res.ok) {
          return setGetPostFailure(data.message);
        }

        if (res.ok) {
          console.log(data);

          setPost(data.post);
          setTitle(data.post.title);
          setContent(data.post.content);
          if (data.post.userId === currentUser?._id) {
            setIsOwner(true);
          }
        }
      } catch (err) {
        console.error(err);
        setGetPostFailure(err.message);
      } finally {
        setGetPostLoading(false);
      }
    };

    loadPost();
  }, []);

  if (getPostLoading) {
    return <div className="w-5xl min-h-screen mx-auto">Loading...</div>;
  }

  if (getPostFailure) {
    return (
      <div className="w-5xl min-h-screen mx-auto">
        <div className="bg-red-100 mt-4 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
          Ошибка при получении данных: {getPostFailure}
        </div>
      </div>
    );
  }

  if (!post) return null;

  const updatePost = async () => {
    setPostFailure(null);
    setPostLoading(true);
    try {
      const res = await fetch(`/api/post/update/${post.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setPostFailure(data.message);
      }

      if (res.ok) {
        setPost(data.updatedPost);
        setIsEdit(false);
        setTitle(data.updatedPost.title);
        setContent(data.updatedPost.content);
      }
    } catch (err) {
      setPostFailure(err.message);
    } finally {
      setPostLoading(false);
    }
  };

  const handleRemovePost = async () => {
    setPostLoading(true);
    try {
      const res = await fetch(`/api/post/delete/${post._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        setPostFailure(data.message);
      }
      if (res.ok) {
        navigate("/dashboard?tab=posts");
      }
    } catch (err) {
      setPostFailure(err.message);
    } finally {
      setPostLoading(true);
    }
  };

  return (
    <div className="w-5xl min-h-screen mx-auto p-4 dark:bg-gray-900 bg-gray-100 flex flex-col">
      {postFailure && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
          Ошибка при обновлении данных: {postFailure}
        </div>
      )}
      {currentUser && isOwner && (
        <div className="mb-4 flex gap-2">
          {isEdit ? (
            <button
              disabled={postLoading}
              onClick={() => updatePost()}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-[0.5]"
            >
              {postLoading ? "Загрузка..." : "Сохранить"}
            </button>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 "
            >
              Изменить
            </button>
          )}
          {!isEdit ? (
            <button
              onClick={handleRemovePost}
              disabled={postLoading}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700  disabled:opacity-[0.5]"
            >
              {postLoading ? "Загрузка..." : "Удалить"}
            </button>
          ) : (
            <button
              disabled={postLoading}
              onClick={() => setIsEdit(false)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-[0.5]"
            >
              Отмена
            </button>
          )}
        </div>
      )}
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full max-h-96 object-cover rounded mb-6"
        />
      )}

      {isEdit ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updatePost();
          }}
          className="flex flex-col gap-3"
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            name="title"
            placeholder="Заголовок"
            className="p-2 border border-gray-100 dark:bg-[transparent] bg-gray-100"
          />
          <TextEditor content={content} onChange={setContent} />
        </form>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </>
      )}
      <CommentSection />
    </div>
  );
}
