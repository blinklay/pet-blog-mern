import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../features/user/userSlice";

export default function ProfileTab({ user }) {
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const dispatch = useDispatch();
  const filePickerRef = useRef();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);
  const uploadImage = async () => {
    if (!imageFile) return;

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "unsigned_preset");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dov0xxabv/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      console.log(data);

      const updateRes = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          imageUrl: data.secure_url,
        }),
      });

      const updateUser = await updateRes.json();
      console.log(updateUser);
      dispatch(signInSuccess(updateUser));
    } catch (err) {
      console.error("Ошибка при загрузке:", err);
    }
  };
  return (
    <div className="p-6 max-w-xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-md space-y-6">
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
        ref={filePickerRef}
      />
      <div className="flex items-center space-x-6">
        <img
          className="w-24 h-24 rounded-full object-cover ring-2 ring-blue-500"
          src={imageFileUrl || user.profilePicture}
          alt={`${user.username}'s profile`}
          onClick={() => filePickerRef.current.click()}
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user.username}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
        </div>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400">
        <p>
          <strong>Account created:</strong>{" "}
          {new Date(user.createdAt).toLocaleDateString()}
        </p>
        <p>
          <strong>Last updated:</strong>{" "}
          {new Date(user.updatedAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex gap-4 mt-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
          Выйти
        </button>
        <button className="px-4 py-2 bg-red-400 text-white rounded hover:bg-red-600 transition">
          Удалить аккаунт
        </button>
      </div>
    </div>
  );
}
