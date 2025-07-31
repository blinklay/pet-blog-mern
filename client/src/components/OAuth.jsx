import React from "react";
import { FaGoogle } from "react-icons/fa";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";
export default function OAuth() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      dispatch(signInStart());
      const result = await signInWithPopup(auth, provider);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          googlePhotoUrl: result.user.photoURL,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      dispatch(signInFailure(err.message));
    }
  };
  return (
    <button
      disabled={loading}
      onClick={handleGoogleClick}
      className="flex items-center p-2 gap-2 border-2 justify-center border-gray-300 hover:bg-gray-200 rounded-md disabled:opacity-[0.5]"
      type="button"
    >
      <FaGoogle />
      <span className="font-semibold">Войти с помощью google</span>
    </button>
  );
}
