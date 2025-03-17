import { prisma } from "../prisma";
import getCurrentUser from "./getCurrentUser";

export default async function getDepartments() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return { departments: [], timeSlots: [] };
    }

    const departments = await prisma.department.findMany({
      where: {
        enabled: true,
      },
      include: {
        departmentSchedules: {
          select: {
            dayOfWeek: true,
            enabled: true,
          },
        },
      },
    });

    const timeSlots = await prisma.timeSlot.findMany();

    if (!departments && !timeSlots) {
      return { departments: [], timeSlots: [] };
    }

    return { departments, timeSlots };
  } catch (error) {
    return { departments: [], timeSlots: [] };
  }
}
