import  { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <header className="flex px-4 py-2 gap-4 overflow-auto bg-transaprent text-white">
      {/* logo */}
      <div
        onClick={() => navigate("/")}
        className="size-12 border-2 hover:cursor-pointer"
      >
        logo
      </div>

      {/* nav links */}
      <div className="hidden md:flex flex-grow px-8 py-2 justify-end gap-8">
        <button
          onClick={() => navigate("/")}
          className="px-2 rounded-md font-semibold hover:bg-gray-300 hover:text-black transition-all"
        >
          Home
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-2 rounded-md font-semibold hover:bg-gray-300 hover:text-black transition-all"
        >
          Dashboard
        </button>
        <button
          onClick={() => navigate("/profile")}
          className="px-2 rounded-md font-semibold hover:bg-gray-300 hover:text-black transition-all"
        >
          Profile
        </button>
        <button
          onClick={() => navigate("/support")}
          className="px-2 rounded-md font-semibold hover:bg-gray-300 hover:text-black transition-all"
        >
          Support
        </button>
      </div>

      {/* login */}
      {/* add w-1/12 if want fixed */}
      <div className="hidden md:flex justify-center">
        {loggedIn ? (
          <div>Profile</div>
        ) : (
          <div className="flex gap-4 py-2">
            <button
              onClick={() => navigate("/login")}
              className="px-2 rounded-md font-semibold bg-black hover:bg-gray-300 hover:text-black transition-all"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-2 rounded-md font-semibold bg-white hover:bg-gray-300 text-black transition-all"
            >
              Signup
            </button>
          </div>
        )}
      </div>

      {/* hamburger */}
      <div className="flex md:hidden flex-grow px-8 py-2 justify-end">
        hamburger
      </div>
    </header>
  );
}
