import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function getCurrentUser() {
  try {
    // Dummy data, use mextjs session data or others
    const sessionData = await auth();

    if (!sessionData) {
      return null;
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        id: sessionData.user?.id,
      },
    });

    if (!currentUser) {
      return null;
    }

    return currentUser;
  } catch (error) {
    console.log("error: getCurrentUser", error);
    return null;
  }
}
