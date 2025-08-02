import React, { useState } from "react";
import { useSelector } from "react-redux";
import ExitButton from "./ExitButton";
import { Link } from "react-router-dom";

export default function UserMenu() {
  const { currentUser } = useSelector((state) => state.user);
  const [isDrop, setIsDrop] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setIsDrop((prev) => !prev)}
        className="w-10 h-10 rounded-full overflow-hidden cursor-pointer flex items-center justify-center"
      >
        <img
          className="objcet-cover"
          src={currentUser.profilePicture}
          alt="Аватар пользователя"
        />
      </button>

      {isDrop && (
        <div className="absolute top-full right-0 border-2 border-gray-300 bg-white px-4 py-2 dark:text-black dark:bg-zinc-500">
          <p className="font-semibold">Профиль</p>
          <p>{currentUser.username}</p>

          <div className="flex gap-3 mt-3">
            <Link
              to="/dashboard?tab=profile"
              className="bg-blue-500 text-white px-2 rounded-sm"
            >
              Профиль
            </Link>
            <ExitButton />
          </div>
        </div>
      )}
    </div>
  );
}
