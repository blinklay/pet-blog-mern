import React, { useRef, useState } from "react";
import TextEditor from "../components/RichTextEditor";
export default function CreatePostPage() {
  const fileRef = useRef();
  const [fileName, setFileName] = useState(null);
  const [content, setContent] = useState("");
  return (
    <div className="min-h-screen p-3 max-w-3xl mx-auto">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Создать новый пост
      </h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justiffy-between">
          <input
            type="text"
            id="title"
            placeholder="Загаловок"
            className="flex-1 border border-gray-300 p-2"
          />

          <select className="border border-gray-300" id="category">
            <option value="uncategory">Выберете категорию</option>
            <option value="javascript">JavaScript</option>
            <option value="react.js">React.js</option>
            <option value="next.js">Next.js</option>
          </select>
        </div>

        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <input
            onChange={(e) => setFileName(e.target.files[0].name)}
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
            <span>{fileName || "Файл не выбран"}</span>
          </div>
          <button
            type="button"
            className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
          >
            Добавить картинку
          </button>
        </div>

        <TextEditor content={content} onChange={setContent} />
        <button
          type="submit"
          className="bg-blue-500 p-2 text-white rounded-md hover:bg-blue-600 transition"
        >
          Создать пост
        </button>
      </form>
    </div>
  );
}
