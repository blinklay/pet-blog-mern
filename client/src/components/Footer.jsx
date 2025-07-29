import { Link } from "react-router-dom";
import Navigation from "./Navigation";
import Search from "./Search";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold text-gray-900">
          MyBlog
        </Link>

        <div className="flex gap-5 flex-col lg:flex-row">
          <div className="flex flex-col gap-3">
            <span className="font-semibold">Навигация</span>
            <div className="flex flex-col gap-2">
              <Link to="/">Главная</Link>
              <Link to="/">О нас</Link>
              <Link to="/">Проекты</Link>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-semibold">Документация</span>
            <div className="flex flex-col gap-2">
              <Link to="/privacy-policy">Политика конфеденциальности</Link>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-semibold">Контакты</span>
            <div className="flex flex-col gap-2">
              <a href="telto:79010351783">+79010351783</a>
              <a href="mailto:myblog@myblog.org">myblog@myblog.org</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
