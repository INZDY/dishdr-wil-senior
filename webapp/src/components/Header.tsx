"use client";

import { useTranslation } from "@/app/i18n/client";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function Header({ lng }: { lng: string }) {
  const { t } = useTranslation(lng, "make-appointment");
  const router = useRouter();

  const { data: session } = useSession();

  const currentPath = usePathname().substring(3);
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSwitchLanguage = () => {
    if (lng === "en") {
      router.push(`/th/${currentPath}`);
    } else {
      router.push(`/en/${currentPath}`);
    }
    toast.success("Language switched");
  };

  return (
    <header className="flex px-4 py-2 gap-4 overflow-auto bg-transaprent text-white">
      {/* logo */}
      <div
        onClick={() => router.push(`/${lng}`)}
        className="size-12 border-2 hover:cursor-pointer"
      >
        logo
      </div>

      {/* nav links */}
      <div className="hidden md:flex flex-grow px-8 py-2 justify-end gap-8">
        <button
          onClick={() => router.push(`/${lng}`)}
          className="px-2 rounded-md font-semibold hover:bg-gray-300 hover:text-black transition-all"
        >
          {t("home")}
        </button>
        <button
          onClick={() => router.push(`/${lng}/activity`)}
          className="px-2 rounded-md font-semibold hover:bg-gray-300 hover:text-black transition-all"
        >
          {t("activity")}
        </button>
        <button
          onClick={() => router.push(`/${lng}/profile`)}
          className="px-2 rounded-md font-semibold hover:bg-gray-300 hover:text-black transition-all"
        >
          {t("profile")}
        </button>
      </div>

      {/* login */}
      {/* add w-1/12 if want fixed */}
      <div className="hidden md:flex justify-center">
        {session != null ? (
          <div className="flex p-2 gap-2 items-center rounded-md bg-neutral-200 shadow-md">
            <img
              src={session.user?.image!}
              alt="avatar"
              className="size-8 rounded-full shadow-md"
            />
            <p className="text-black font-semibold">{session.user?.name}</p>
          </div>
        ) : (
          <div className="flex gap-4 py-2">
            <button
              onClick={() => router.push(`/${lng}/auth`)}
              className="px-2 rounded-md font-semibold bg-black hover:bg-gray-300 hover:text-black transition-all"
            >
              {t("login")}
            </button>
            <button
              onClick={() => router.push(`/${lng}/auth`)}
              className="px-2 rounded-md font-semibold bg-white hover:bg-gray-300 text-black transition-all"
            >
              {t("signup")}
            </button>
          </div>
        )}
      </div>
      <div className="border-l-2 border-white" />

      {/* language switcher */}
      <div className="flex gap-4 py-2">
        <button
          onClick={handleSwitchLanguage}
          className="px-2 rounded-md font-semibold bg-white hover:bg-gray-300 text-black transition-all"
        >
          <p>
            {lng === "en" ? "Language:" : "ภาษา:"}
            <span className="ml-1">{lng.toUpperCase()}</span>
          </p>
        </button>
      </div>

      {/* hamburger */}
      <div className="flex md:hidden flex-grow px-8 py-2 justify-end">
        hamburger
      </div>
    </header>
  );
}
