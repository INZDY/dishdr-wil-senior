"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

export default function Profile({ params }: { params: any }) {
  const { lng } = React.use<{ lng: string }>(params);
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    router.push("/");
  }
  return <div>ProfilePage</div>;
}
