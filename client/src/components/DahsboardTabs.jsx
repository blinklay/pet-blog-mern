import { NavLink, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { userSelect } from "../features/user/userSelect";

const tabs = [
  { label: "Профиль", value: "profile" },
  { label: "Комментарии", value: "comments" },
];

const adminTabs = [
  { label: "Посты", value: "posts" },
  { label: "Пользователи", value: "users" },
];

export default function DashboardTabs() {
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "profile";
  const { currentUser } = useSelector(userSelect);
  return (
    <div className="flex space-x-4 border-b pb-2 mb-4">
      {currentUser.isAdmin &&
        tabs.concat(adminTabs).map((tab) => (
          <NavLink
            key={tab.value}
            to={`/dashboard?tab=${tab.value}`}
            className={({ isActive }) =>
              `px-4 py-2 rounded-t-md text-sm font-medium ${
                currentTab === tab.value
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      {!currentUser.isAdmin &&
        tabs.map((tab) => (
          <NavLink
            key={tab.value}
            to={`/dashboard?tab=${tab.value}`}
            className={({ isActive }) =>
              `px-4 py-2 rounded-t-md text-sm font-medium ${
                currentTab === tab.value
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
    </div>
  );
}
