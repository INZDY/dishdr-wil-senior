import { prisma } from "../prisma";
import getCurrentUser from "./getCurrentUser";

export default async function getActivities() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return [];
    }

    const activities = await prisma.appointment.findMany({
      where: {
        patientId: currentUser.id,
      },
    });

    if(!activities) {
      return [];
    }

    return activities;
  } catch (error) {
    return [];
  }
}
