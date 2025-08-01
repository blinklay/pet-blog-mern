import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { useSelector } from "react-redux";
import UserMenu from "./UserMenu";
import ExitButton from "./ExitButton";

const navLinks = [
  { to: "/", label: "Главная" },
  { to: "/about", label: "О сайте" },
  { to: "/projects", label: "Проекты" },
];

export default function Navigation() {
  const [visible, setVisible] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div>
      {/* Desktop Navigation */}
      <nav className="gap-6 items-center hidden xl:flex ">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="text-gray-700 dark:text-white hover:text-blue-600"
          >
            {link.label}
          </Link>
        ))}
        {currentUser ? (
          <UserMenu />
        ) : (
          <Link
            to="/sign-in"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
          >
            Войти
          </Link>
        )}
      </nav>

      {/* Burger Button */}
      <div className="xl:hidden flex items-center gap-3">
        <UserMenu />
        <button
          onClick={() => setVisible(true)}
          className="p-2 text-blue-500 border border-blue-500 rounded-md"
          aria-label="Открыть меню"
        >
          <RxHamburgerMenu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {visible && (
        <div className="fixed inset-0 z-50 flex">
          {/* Затемнение фона */}
          <div
            className="flex-1 bg-black/40"
            onClick={() => setVisible(false)}
          ></div>

          {/* Сайдбар */}
          <nav className="w-80 bg-white h-full p-5 shadow-xl transform transition-transform duration-300 translate-x-0 flex flex-col justify-between">
            <div>
              {/* Кнопка закрытия */}
              <button
                onClick={() => setVisible(false)}
                className="absolute top-4 right-4 text-gray-700 hover:text-red-600"
                aria-label="Закрыть меню"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Ссылки */}
              <div className="mt-8 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setVisible(false)}
                    className="text-gray-700 hover:bg-blue-100 px-4 py-2 rounded-md text-lg"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Кнопка входа */}
            {currentUser ? (
              <ExitButton className={"px-6 py-2"} />
            ) : (
              <Link
                to="/sign-in"
                onClick={() => setVisible(false)}
                className="bg-blue-500 text-white rounded-md  px-6 py-2 hover:bg-blue-600 text-center"
              >
                Войти
              </Link>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
