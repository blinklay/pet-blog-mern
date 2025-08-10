import { NavLink, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { userSelect } from "../features/user/userSelect";

const tabs = [
  { label: "Профиль", value: "profile" },
  { label: "Комментарии", value: "comments" },
  { label: "Посты", value: "posts" },
];

export default function DashboardTabs() {
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "profile";
  const { currentUser } = useSelector(userSelect);
  return (
    <div className="flex space-x-4 border-b pb-2 mb-4">
      {currentUser.isAdmin &&
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
      {!currentUser.isAdmin &&
        tabs
          .filter((item) => item.value !== "posts")
          .map((tab) => (
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
