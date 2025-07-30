import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function SignInPage() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    if (!formData.email || !formData.password) {
      setErrorMessage("Все поля должны быть заполнены!");
    }

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      if (res.ok) {
        navigate("/");
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
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
            className="p-2 bg-gray-100 border border-blue-500 disabled:opacity-[0.5]"
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
            className="p-2 bg-gray-100 border border-blue-500 disabled:opacity-[0.5]"
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
