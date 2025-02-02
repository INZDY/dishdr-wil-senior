// "use client";
import React from "react";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { signIn } from "@/auth";

export default function Auth({ params }: { params: any }) {
  const { lng } = React.use<{ lng: string }>(params);

  const handleLineLogin = async () => {
    "use server";
    await signIn("line", { redirectTo: `/${lng}/activity` });
  };

  return (
    <div className="flex flex-col items-center max-w-screen-md mx-auto my-12 py-36 gap-4 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Log in</h1>
      <Button
        className="flex px-8 bg-green-500 text-black"
        onClick={handleLineLogin}
      >
        {/* <div>LINELOGO</div> */}
        {/* <Image src={`/line_44.png`} alt="icon" width={40} height={40}/> */}
        <p className="text-white font-bold">Log in with LINE</p>
      </Button>
    </div>
  );
}
