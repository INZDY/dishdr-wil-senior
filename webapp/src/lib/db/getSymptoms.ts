import { prisma } from "../prisma";
import getCurrentUser from "./getCurrentUser";

export default async function getSymptoms() {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return [];
    }

    const symptoms = await prisma.symptom.findMany();

    if (!symptoms) {
      return [];
    }

    return symptoms;
  } catch (error) {
    return [];
  }
}
