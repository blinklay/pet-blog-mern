import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../features/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignInPage() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Все поля должны быть заполнены!"));
    }

    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (err) {
      dispatch(signInFailure(err.message));
    }
  };

  return (
    <div className="min-h-screen mt-20 max-w-5xl mx-auto px-2">
      <h1 className="text-2xl font-semibold mb-20">Авторизация:</h1>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label htmlFor="username">Почта:</label>
          <input
            onChange={handleChange}
            className="p-2 bg-gray-100 border border-blue-500 disabled:opacity-[0.5] dark:bg-gray-400"
            type="email"
            placeholder="email"
            id="email"
            disabled={loading}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password">Пароль:</label>
          <input
            disabled={loading}
            onChange={handleChange}
            className="p-2 bg-gray-100 border border-blue-500 disabled:opacity-[0.5] dark:bg-gray-400"
            type="password"
            placeholder="********"
            id="password"
          />
        </div>

        <button
          disabled={loading}
          className="bg-blue-500 p-2 rounded-md text-white disabled:bg-blue-800 disabled:text-gray-200"
        >
          {loading ? "Загрузка..." : "Отправить"}
        </button>
        <OAuth />
      </form>

      <div className="flex gap-2 mt-4">
        <span>Нет аккаунта?</span>
        <Link className="text-blue-500" to="/sign-up">
          Регистрация!
        </Link>
      </div>

      {errorMessage && (
        <div className="bg-red-200 p-3 text-md mt-4 rounded-md">
          <span className="font-semibold text-md">Ошибка:</span>
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
