import { prisma } from "@/lib/prisma";

export default async function getCurrentUser() {
  try {
    // Dummy data, use mextjs session data or others
    const sessionData = {
      userId: "m5xvlaj522ldwmn3q3rr0m8l",
    };

    if (!sessionData) {
      return null;
    }
    
    const currentUser = await prisma.user.findFirst({
      where: {
        id: sessionData.userId,
      },
    });
    
    if (!currentUser) {
      return null;
    }

    return currentUser;
  } catch (error) {
    console.log('error: getCurrentUser', error);
    return null;
  }
}
