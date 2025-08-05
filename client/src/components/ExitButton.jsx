import { useDispatch } from "react-redux";
import { signOutSuccess } from "../features/user/userSlice";

export default function ExitButton({ className }) {
  const dispatch = useDispatch();
  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <button
      onClick={handleSignout}
      className={`bg-red-400 text-white px-2 ${className}`}
    >
      Выйти
    </button>
  );
}
