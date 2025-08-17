import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { userSelect } from "../features/user/userSelect";
import { GrUserAdmin } from "react-icons/gr";
import { MdDelete } from "react-icons/md";

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [getUsersFailure, setGetUsersFailure] = useState(null);
  const [getUsersLoading, setGetUsersLoading] = useState(false);
  const { currentUser } = useSelector(userSelect);
  const [showMore, setShowMore] = useState(true);
  useEffect(() => {
    const loadUsers = async () => {
      setGetUsersLoading(true);
      setGetUsersFailure(null);
      try {
        const res = await fetch("/api/user/getAllUsers");
        const data = await res.json();
        if (!res.ok) {
          setGetUsersFailure(data.message);
        }
        if (res.ok) {
          setUsers(data);
          if (data.length > 10) {
            setShowMore(true);
          }
        }
      } catch (err) {
        setGetUsersFailure(err.message);
      } finally {
        setGetUsersLoading(false);
      }
    };

    if (currentUser.isAdmin) loadUsers();
  }, []);

  if (getUsersFailure) {
    return (
      <div className="min-h-screen w-5xl mx-auto">
        <div className="bg-red-200 p-3 text-md mt-4 rounded-md">
          <span className="font-semibold text-md">Ошибка:</span>
          <p>{getUsersFailure}</p>
        </div>
      </div>
    );
  }

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getAllUsers?startIndex=${startIndex}`);
      const data = await res.json();

      if (!res.ok) {
        setGetUsersFailure(data.message);
      }
      if (res.ok) {
        setUsers((prev) => [...prev, ...data]);
        if (data.length < 10) {
          setShowMore(false);
        }
      }
    } catch (err) {
      setGetUsersFailure(err.message);
    }
  };

  const handleChangeRole = () => {};

  const handleDeleteUser = () => {};
  const handleSearchUsers = async (e) => {
    e.preventDefault();
  };
  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">
        Список пользователей
      </h1>
      <form
        className="mb-6 flex items-center gap-2"
        onSubmit={handleSearchUsers}
      >
        <input
          type="text"
          name="search"
          placeholder="Поиск по имени или email..."
          className="flex-1 p-2 border rounded-md dark:bg-gray-900 dark:text-white"
          autoComplete="off"
        />
        <button
          type="submit"
          className="bg-blue-500 dark:bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-600 dark:hover:bg-blue-800 transition"
        >
          Найти
        </button>
      </form>
      {getUsersLoading ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          Загрузка контента...
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          {users.length === 0 ? (
            <div className="text-gray-500 dark:text-gray-400">
              Нет пользователей.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <li key={user._id} className="flex items-center py-4">
                  <img
                    src={user.profilePicture || "/default-avatar.png"}
                    alt={user.username}
                    className="w-12 h-12 rounded-full object-cover mr-4 border dark:border-gray-700"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-lg dark:text-white">
                      {user.username}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm">
                      {user.email}
                    </div>
                    <div className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                      Зарегистрирован:{" "}
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "—"}
                    </div>
                    {currentUser._id === user._id && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
                        Это вы
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {user.isAdmin ? (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-xs font-medium flex items-center gap-1">
                        <GrUserAdmin className="inline-block" />
                        Админ
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium">
                        Пользователь
                      </span>
                    )}
                    {currentUser.isAdmin && currentUser._id !== user._id && (
                      <>
                        <button
                          title="Сменить роль"
                          className={`ml-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition ${
                            user.isAdmin &&
                            "bg-red-200 dark:bg-red-900 hover:bg-red-300 dark:hover:bg-red-800"
                          }`}
                          onClick={() => handleChangeRole(user._id)}
                        >
                          <GrUserAdmin className="text-lg text-blue-600 dark:text-blue-400" />
                        </button>
                        <button
                          title="Удалить пользователя"
                          className="ml-2 p-2 rounded hover:bg-red-100 dark:hover:bg-red-900 transition"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          <MdDelete className="text-lg text-red-600 dark:text-red-400" />
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {showMore && (
        <button
          onClick={handleShowMore}
          className="bg-indigo-500 dark:bg-indigo-700 text-white p-2 rounded-md w-full mt-3 hover:bg-indigo-600 dark:hover:bg-indigo-800 transition"
        >
          Показать еще
        </button>
      )}
    </div>
  );
}
