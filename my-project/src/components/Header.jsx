import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "../utils/noteApi.js";
import portfolioImg from "../assets/test.jpg";

function Header({ onSearchClick }) {
  const [showDropdown, setShowDropdown] = useState(false);

  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();

      // تنظيف الكاش والـ storages
      queryClient.clear();
      localStorage.clear();
      sessionStorage.clear();

      // اغلاق الـ dropdown لو مفتوح
      setShowDropdown(false);

      // منع الرجوع نهائيًا
      window.history.pushState(null, "", window.location.href);
      window.onpopstate = function () {
        window.history.pushState(null, "", window.location.href);
      };

      // توجيه آمن
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
      queryClient.clear();
      localStorage.clear();
      sessionStorage.clear();
      setShowDropdown(false);
      navigate("/login", { replace: true });
    }
  }; // <-- مهم: إغلاق الدالة هنا

  const isCreatePage = location.pathname === "/create";

  return (
    <header className="w-full flex items-center justify-between border-b border-stone-200 bg-[#f6f7f7] dark:bg-[#161b1c] dark:border-stone-800 px-10 py-3">
      <div className="flex items-center gap-3">
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 text-stone-900 dark:text-primary"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <g fillRule="evenodd">
            <path d="M5 19h14V5H5v14zM19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
            <path d="M6.287 8.62H17.11V6.437H6.288v2.18zm0 4.36H17.11V10.8H6.288v2.18zm0 4.363h6.494v-2.18H6.288v2.18z" />
          </g>
        </svg>
        <NavLink to="/">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-stone-900 dark:text-stone-200">
            NoteIt
          </h1>
        </NavLink>
      </div>

      <div className="flex items-center gap-4">
        {isCreatePage ? (
          <button
            onClick={onSearchClick}
            className="flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-primary/20 dark:bg-primary/30 text-primary hover:bg-primary/30 dark:hover:bg-primary/40"
          >
            <span className="material-symbols-outlined text-2xl">search</span>
          </button>
        ) : (
          <NavLink
            to="/create"
            className="flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-primary/20 dark:bg-primary/30 text-primary hover:bg-primary/30 dark:hover:bg-primary/40"
          >
            <span className="material-symbols-outlined text-2xl">add</span>
          </NavLink>
        )}

        {/* Profile Dropdown */}
        <div className="relative">
          <img
            className="h-8 sm:h-9 md:h-10 lg:h-11 rounded-full object-cover cursor-pointer"
            src={portfolioImg}
            alt="profile"
            onClick={() => setShowDropdown(!showDropdown)}
          />

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-stone-900 rounded-lg shadow-lg border border-stone-200 dark:border-stone-800 py-2 z-50">
              <NavLink
                to="/profile"
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-3 px-4 py-2 text-stone-900 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <span className="material-symbols-outlined text-xl">person</span>
                <span>Profile</span>
              </NavLink>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2 text-red-600 dark:text-red-400 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <span className="material-symbols-outlined text-xl">logout</span>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
