"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";
import Image from "next/image";

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
        className="flex px-8 py-6 bg-green-500"
        onClick={() => signIn("line", { redirectTo: `/${lng}/activity` })}
      >
        {/* <Image src="/line_44.png" alt="icon" width={20} height={20} /> */}
        <p className="text-white font-bold">{t("line-login")}</p>
      </Button>
    </div>
  );
}
