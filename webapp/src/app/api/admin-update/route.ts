import getCurrentUser from "@/lib/db/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { userId, isAdmin } = body;

    if (!currentUser?.id || !currentUser.isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isAdmin: isAdmin,
      },
    });

    if (!updatedUser) {
      return new NextResponse("Internal Server Error", { status: 500 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {}
}
