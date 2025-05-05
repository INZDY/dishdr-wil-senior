import getUsers from "@/lib/db/getUsers";
import { NextResponse } from "next/server";

export async function GET() {
  const currentUser = await getUsers();

  return NextResponse.json(currentUser);
}
