import React, { useRef, useState } from "react";
import TextEditor from "../components/RichTextEditor";
import { useNavigate } from "react-router-dom";
export default function CreatePostPage() {
  const fileRef = useRef();
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const handleUploadImage = async () => {
    if (!imageFile) {
      return setErrorMessage("Выберете изображение!");
    }
    setErrorMessage(null);
    setImageFileUrl(URL.createObjectURL(imageFile));
    const uploadData = new FormData();
    uploadData.append("file", imageFile);
    uploadData.append("upload_preset", "unsigned_preset");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dov0xxabv/image/upload",
        {
          method: "POST",
          body: uploadData,
        }
      );

      const data = await res.json();
      if (!res.ok) {
        console.log(res);

        throw new Error("Ошибка загрузки картинки!");
      }
      setFormData({ ...formData, image: data.secure_url });
    } catch (err) {
      console.error("Ошибка при отправке!", err);
      setErrorMessage(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.message);
        return;
      }
      if (res.ok) {
        setErrorMessage(null);
        console.log(data);

        navigate(`/post/${data.slug}`);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen p-3 max-w-3xl mx-auto">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Создать новый пост
      </h1>
      {formData.image && (
        <img src={imageFileUrl} alt="Обложка поста" className="max-h-[540px]" />
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
        <div className="flex flex-col gap-4 sm:flex-row justiffy-between">
          <input
            type="text"
            id="title"
            placeholder="Загаловок"
            className="flex-1 border border-gray-300 p-2"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="border border-gray-300"
            id="category"
          >
            <option value="uncategory">Выберете категорию</option>
            <option value="javascript">JavaScript</option>
            <option value="react.js">React.js</option>
            <option value="next.js">Next.js</option>
          </select>
        </div>

        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <input
            onChange={(e) => setImageFile(e.target.files[0])}
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileRef}
          />
          <div className="flex gap-3 items-center">
            <button
              type="button"
              onClick={() => fileRef.current.click()}
              className="bg-teal-500 rounded-md p-2 text-sm text-white hover:bg-teal-600 transition"
            >
              Выбрать файл
            </button>
            <span>{imageFile?.name || "Файл не выбран"}</span>
          </div>
          <button
            onClick={handleUploadImage}
            type="button"
            className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
          >
            Добавить картинку
          </button>
        </div>

        <TextEditor
          content={formData.content}
          onChange={(e) => {
            setFormData({ ...formData, content: e });
          }}
        />
        <button
          type="submit"
          className="bg-blue-500 p-2 text-white rounded-md hover:bg-blue-600 transition"
        >
          Создать пост
        </button>
      </form>
      {errorMessage && (
        <div className="p-3 bg-red-100 text-red-600 mt-2 rounded-md">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
