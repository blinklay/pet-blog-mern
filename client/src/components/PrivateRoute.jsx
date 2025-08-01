import React from "react";
import { useSelector } from "react-redux";
import { userSelect } from "../features/user/userSelect";
import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoute() {
  const { currentUser } = useSelector(userSelect);

  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
}
