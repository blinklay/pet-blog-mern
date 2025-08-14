import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { userSelect } from "../features/user/userSelect";
export default function SinglePostPage() {
  const { postSlug } = useParams();
  const [post, setPost] = useState(null);
  const [getPostLoading, setGetPostLoading] = useState(false);
  const [getPostFailure, setGetPostFailure] = useState(null);
  const { currentUser } = useSelector(userSelect);
  const [isOwner, setIsOwner] = useState(false);

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
          if (data.post.userId === currentUser._id) {
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
      <div className="w-5xl min-h-screen mx-auto text-red-500">
        {getPostFailure}
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="w-5xl min-h-screen mx-auto p-4">
      {isOwner && (
        <div className="mb-4 flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Edit
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Delete
          </button>
        </div>
      )}
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full max-h-96 object-cover rounded mb-6"
        />
      )}
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}
