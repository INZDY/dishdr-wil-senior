import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    return NextResponse.json(session);
  } catch (error) {
    return new NextResponse(JSON.stringify(error));
  }
}
