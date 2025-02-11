import { prisma } from "../prisma";
import getCurrentUser from "./getCurrentUser";

export default async function getActivities() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return [];
    }

    if (currentUser.role === "staff") {
      const allActivities = await prisma.appointment.findMany({
        include: {
          symptoms: true,
          // user: { include: { profile: true } },
        },
        orderBy: { dateTime: "desc" },
      });

      if (!allActivities) {
        return [];
      }

      return allActivities;
    } else if (currentUser.role === "patient") {
      const userActivities = await prisma.appointment.findMany({
        where: {
          userId: currentUser.id,
        },
        include: {
          symptoms: true,
          // user: { include: { profile: true } },
        },
        orderBy: { dateTime: "desc" },
      });

      if (!userActivities) {
        return [];
      }
      return userActivities;
    }

    return [];
  } catch (error) {
    return [];
  }
}
