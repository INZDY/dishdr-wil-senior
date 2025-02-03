"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Auth({ params }: { params: any }) {
  const { lng } = React.use<{ lng: string }>(params);
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    router.push(`/${lng}/activity`);
  }

  return (
    <div className="flex flex-col items-center max-w-screen-md mx-auto my-12 py-36 gap-4 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Log in</h1>
      <Button
        className="flex px-8 bg-green-500 text-black"
        onClick={() => signIn("line", { redirectTo: `/${lng}/activity` })}
      >
        {/* <div>LINELOGO</div> */}
        {/* <Image src={`/line_44.png`} alt="icon" width={40} height={40}/> */}
        <p className="text-white font-bold">Log in with LINE</p>
      </Button>
    </div>
  );
}
