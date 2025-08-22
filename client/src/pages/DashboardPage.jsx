import React from "react";
import DashboardTabs from "../components/DahsboardTabs";
import { useSearchParams } from "react-router-dom";
import ProfileTab from "../components/ProfileTab";
import { useSelector } from "react-redux";
import { userSelect } from "../features/user/userSelect";
import PostsTab from "../components/PostsTab";
import UsersTab from "../components/UsersTab";
import CommentsTab from "../components/CommentsTab";

export default function DashboardPage() {
  const { currentUser } = useSelector(userSelect);
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "profile";
  return (
    <div className="min-h-screen max-w-5xl mx-auto mt-10">
      <DashboardTabs />

      {tab === "profile" && <ProfileTab user={currentUser} />}
      {tab === "comments" && <CommentsTab />}
      {tab === "posts" && <PostsTab />}
      {tab === "users" && <UsersTab />}
    </div>
  );
}
