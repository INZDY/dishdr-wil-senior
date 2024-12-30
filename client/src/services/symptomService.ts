import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getSymptoms = async () => {
  return prisma.symptom.findMany();
};