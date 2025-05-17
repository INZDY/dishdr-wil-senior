"use client";
import React from "react";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";
import Image from "next/image";
import line from "@/../public/line.png";

export default function Auth({ params }: { params: any }) {
  const { lng } = React.use<{ lng: string }>(params);
  const { t } = useTranslation(lng, "translation");
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    router.push(`/${lng}/activity`);
  }

  return (
    <div className="flex flex-col items-center max-w-screen-md mx-auto my-12 pt-24 pb-36 gap-2 bg-neutral-100 shadow rounded">
      <h1 className="text-2xl font-bold mb-4">{t("login")}</h1>
      <Button
        className="flex p-6 bg-green-500"
        onClick={() => signIn("line", { redirectTo: `/${lng}/activity` })}
      >
        <Image src={line} alt="" width={35} height={35} />
        <p className="text-white font-bold">{t("line-login")}</p>
      </Button>
    </div>
  );
}
