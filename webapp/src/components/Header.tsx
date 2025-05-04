"use client";

import { useTranslation } from "@/app/i18n/client";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { MdMenu } from "react-icons/md";
import { cn } from "@/lib/utils";

export default function Header({ lng }: { lng: string }) {
  const { t } = useTranslation(lng, "make-appointment");
  const router = useRouter();
  const currentUser = useSession().data?.user;

  const currentPath = usePathname().substring(3);

  const handleSwitchLanguage = (lang: "en" | "th") => {
    if (lang === lng) return;
    else if (lang === "th") {
      router.push(`/th/${currentPath}`);
    } else if (lang === "en") {
      router.push(`/en/${currentPath}`);
    }
    toast.success("Language switched");
  };

  return (
    <header className="flex px-4 py-2 gap-4 overflow-auto bg-transaprent text-white">
      {/* logo */}
      <div
        onClick={() => router.push(`/${lng}`)}
        className="size-12 hover:cursor-pointer"
      >
        {/* logo */}
      </div>

      {/* nav links */}
      <div className="hidden md:flex flex-grow px-8 py-2 justify-end gap-8">
        <button
          onClick={() => router.push(`/${lng}/activity`)}
          className="px-2 rounded-md font-semibold hover:bg-gray-300 hover:text-black"
        >
          {t("activity")}
        </button>
      </div>

      {/* login */}
      {/* add w-1/12 if want fixed */}
      <div className="hidden md:flex justify-center">
        {currentUser != null ? (
          <Popover>
            <PopoverTrigger>
              <div className="flex p-2 gap-2 items-center rounded-md bg-neutral-200 shadow-md hover:cursor-pointer hover:bg-neutral-300">
                <img
                  src={currentUser.image!}
                  alt="avatar"
                  className="size-8 rounded-full shadow-md"
                />
                <p className="text-black font-semibold">{currentUser.name}</p>
              </div>
            </PopoverTrigger>
            <PopoverContent className="flex p-2 w-30">
              <Button
                onClick={() => signOut()}
                className="bg-red-600 font-bold hover:bg-neutral-500"
              >
                {t("logout")}
              </Button>
            </PopoverContent>
          </Popover>
        ) : (
          <div className="flex gap-4 py-2">
            <button
              onClick={() => router.push(`/${lng}`)}
              className="px-2 rounded-md font-semibold bg-black hover:bg-gray-300 hover:text-black"
            >
              {t("login")}
            </button>
          </div>
        )}
      </div>

      {/* language switcher */}
      <div className="hidden md:flex gap-4 px-2 py-2 justify-center items-center border-l-2 border-neutral-400">
        <div
          className={cn(
            "px-2 py-1 rounded-md text-neutral-400 hover:cursor-pointer hover:bg-neutral-700",
            lng === "en" ? "bg-neutral-500" : "bg-transparent"
          )}
          onClick={() => handleSwitchLanguage("en")}
        >
          English
        </div>
        <div
          className={cn(
            "px-2 py-1 rounded-md text-neutral-400 hover:cursor-pointer hover:bg-neutral-700",
            lng === "th" ? "bg-neutral-600" : "bg-transparent"
          )}
          onClick={() => handleSwitchLanguage("th")}
        >
          ภาษาไทย
        </div>
      </div>

      {/* hamburger */}
      <div className="flex md:hidden flex-grow px-2 justify-end">
        <Sheet>
          <SheetTrigger asChild>
            <div className="flex items-center">
              <MdMenu color="white" size={40} />
            </div>
            {/* <Button variant="outline">Open</Button> */}
          </SheetTrigger>
          <SheetTitle></SheetTitle>
          <SheetContent className="w-[200px]">
            <div className="flex flex-col mt-24 items-start gap-8">
              {/* nav links */}
              <button
                onClick={() => router.push(`/${lng}/activity`)}
                className="px-2 rounded-md text-black font-semibold hover:bg-gray-300 hover:text-black"
              >
                {t("activity")}
              </button>

              {/* login */}
              {/* add w-1/12 if want fixed */}
              {currentUser != null ? (
                <Popover>
                  <PopoverTrigger>
                    <div className="flex p-2 gap-2 items-center rounded-md bg-neutral-200 shadow-md hover:cursor-pointer hover:bg-neutral-300">
                      <img
                        src={currentUser.image!}
                        alt="avatar"
                        className="size-8 rounded-full shadow-md"
                      />
                      <p className="text-black font-semibold">
                        {currentUser.name}
                      </p>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="flex p-2 w-30">
                    <Button
                      onClick={() => signOut()}
                      className="bg-red-600 font-bold hover:bg-neutral-500"
                    >
                      {t("logout")}
                    </Button>
                  </PopoverContent>
                </Popover>
              ) : (
                <div className="flex gap-4 py-2">
                  <button
                    onClick={() => router.push(`/${lng}`)}
                    className="px-2 rounded-md font-semibold text-white bg-black hover:bg-gray-300 hover:text-black"
                  >
                    {t("login")}
                  </button>
                </div>
              )}

              {/* language switcher */}
              <div className="flex flex-col gap-4 py-2 border-t-2 border-neutral-300">
                <div
                  className={cn(
                    "px-2 py-1 rounded-md text-neutral-400 hover:cursor-pointer hover:bg-neutral-700",
                    lng === "en" ? "bg-neutral-600" : "bg-transparent"
                  )}
                  onClick={() => handleSwitchLanguage("en")}
                >
                  English
                </div>
                <div
                  className={cn(
                    "px-2 py-1 rounded-md text-neutral-400 hover:cursor-pointer hover:bg-neutral-700",
                    lng === "th" ? "bg-neutral-600" : "bg-transparent"
                  )}
                  onClick={() => handleSwitchLanguage("th")}
                >
                  ภาษาไทย
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
