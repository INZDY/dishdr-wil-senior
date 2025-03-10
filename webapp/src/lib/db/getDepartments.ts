import { prisma } from "../prisma";
import getCurrentUser from "./getCurrentUser";

export default async function getDepartments() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return [];
    }

    const symptoms = await prisma.department.findMany({
      where: {
        enabled: true,
      },
    });

    if (!symptoms) {
      return [];
    }

    return symptoms;
  } catch (error) {
    return [];
  }
}
