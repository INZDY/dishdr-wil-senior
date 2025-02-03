"use client";

import { useTranslation } from "@/app/i18n/client";
import { useCurrentUser } from "@/hooks/use-current-user";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { MdMenu } from "react-icons/md";

export default function Header({ lng }: { lng: string }) {
  const { t } = useTranslation(lng, "make-appointment");
  const router = useRouter();
  const currentUser = useCurrentUser();

  const currentPath = usePathname().substring(3);

  const [open, setOpen] = useState(false);

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
        {/* <button
          onClick={() => router.push(`/${lng}`)}
          className="px-2 rounded-md font-semibold hover:bg-gray-300 hover:text-black transition-all"
        >
          {t("home")}
        </button> */}
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
                Log out
              </Button>
            </PopoverContent>
          </Popover>
        ) : (
          <div className="flex gap-4 py-2">
            <button
              onClick={() => router.push(`/${lng}`)}
              className="px-2 rounded-md font-semibold bg-black hover:bg-gray-300 hover:text-black transition-all"
            >
              {t("login")}
            </button>
            <button
              onClick={() => router.push(`/${lng}`)}
              className="px-2 rounded-md font-semibold bg-white hover:bg-gray-300 text-black transition-all"
            >
              {t("signup")}
            </button>
          </div>
        )}
      </div>
      <div className="hidden md:flex border-l-2 border-white" />

      {/* language switcher */}
      <div className="hidden md:flex gap-4 py-2">
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
                className="px-2 rounded-md text-black font-semibold hover:bg-gray-300 hover:text-black transition-all"
              >
                {t("activity")}
              </button>
              <button
                onClick={() => router.push(`/${lng}/profile`)}
                className="px-2 rounded-md font-semibold hover:bg-gray-300 hover:text-black transition-all"
              >
                {t("profile")}
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
                      Log out
                    </Button>
                  </PopoverContent>
                </Popover>
              ) : (
                <div className="flex gap-4 py-2">
                  <button
                    onClick={() => router.push(`/${lng}`)}
                    className="px-2 rounded-md font-semibold bg-black hover:bg-gray-300 hover:text-black transition-all"
                  >
                    {t("login")}
                  </button>
                  <button
                    onClick={() => router.push(`/${lng}`)}
                    className="px-2 rounded-md font-semibold bg-white hover:bg-gray-300 text-black transition-all"
                  >
                    {t("signup")}
                  </button>
                </div>
              )}

              <div className="flex border-b-2 border-neutral-400" />

              {/* language switcher */}
              <div className="flex gap-4 py-2">
                <button
                  onClick={handleSwitchLanguage}
                  className="px-2 rounded-md font-semibold bg-neutral-200 hover:bg-gray-300 text-black transition-all"
                >
                  <p>
                    {lng === "en" ? "Language:" : "ภาษา:"}
                    <span className="ml-1">{lng.toUpperCase()}</span>
                  </p>
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
