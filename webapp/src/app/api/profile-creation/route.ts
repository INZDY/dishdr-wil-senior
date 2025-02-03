import getCurrentUser from "@/lib/db/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // John Doe is the current user
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { userSessionData } = body;

    // user check
    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // find profile
    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      include: { profile: true },
    });

    //create new user profile
    if (user && user.profile.length == 0) {
      const profile = await prisma.profile.create({
        data: {
          userId: user.id,
          name: user.name,
        },
      });
      return NextResponse.json(profile);
    }

    return new NextResponse("User profile already exists");
  } catch (error: any) {
    console.log(error, "ERROR_NEWAPPOINTMENT");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
