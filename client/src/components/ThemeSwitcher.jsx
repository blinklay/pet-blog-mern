import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { isDarkModeSelect } from "../features/theme/themeSelect";
import { FaSun, FaMoon } from "react-icons/fa";
import { setDarkTheme, setDefaultTheme } from "../features/theme/themeSlice";
export default function ThemeSwitcher() {
  const isDarkMode = useSelector(isDarkModeSelect);
  const dispatch = useDispatch();

  const changeTheme = () => {
    if (isDarkMode) {
      dispatch(setDefaultTheme());
    }

    if (!isDarkMode) {
      dispatch(setDarkTheme());
    }
  };

  return (
    <button onClick={changeTheme}>{isDarkMode ? <FaSun /> : <FaMoon />}</button>
  );
}
