import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signInSuccess,
  signOutSuccess,
} from "../features/user/userSlice";
import Modal from "./Modal";
import { IoIosWarning } from "react-icons/io";
import { userSelect } from "../features/user/userSelect";
export default function ProfileTab({ user }) {
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const dispatch = useDispatch();
  const filePickerRef = useRef();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { loading, error } = useSelector(userSelect);

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
      dispatch(signInSuccess(updateUser));
    } catch (err) {
      console.error("Ошибка при загрузке:", err);
    }
  };

  const deleteUser = async () => {
    dispatch(deleteUserStart());
    try {
      const res = await fetch(`/api/user/delete/${user._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess());
        setIsModalOpen(false);
      }
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (err) {
      console.log(err.message);
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
        <button
          onClick={handleSignout}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Выйти
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-red-400 text-white rounded hover:bg-red-600 transition"
        >
          Удалить аккаунт
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex flex-col gap-4 items-center">
          <IoIosWarning className="text-5xl text-gray-400" />
          <p className="text-2xl font-semibold text-center text-gray-400">
            Вы действительно хотите удалить аккаунт?{" "}
          </p>
          <div className="flex gap-3 flex-col lg:flex-row">
            <button
              onClick={deleteUser}
              disabled={loading}
              className="bg-red-500 p-3 text-white rounded-md disabled:opacity-[0.5]"
            >
              Да, я уверен!
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-400 p-3 text-white rounded-md"
            >
              Нет, я передумал!
            </button>
          </div>

          {error && (
            <div className="bg-red-400 border border-red-500 text-red-100 p-3 text-center rounded-md">
              {error}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
