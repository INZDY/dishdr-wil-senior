import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function getUsers() {
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

    if (!currentUser || !currentUser.isAdmin) {
      return null;
    }

    const allUsers = prisma.user.findMany({
      select: {
        id: true,
        image: true,
        name: true,
        role: true,
        isAdmin: true,
      },
    });

    return allUsers;
  } catch (error) {
    console.log("error: getCurrentUser", error);
    return null;
  }
}
