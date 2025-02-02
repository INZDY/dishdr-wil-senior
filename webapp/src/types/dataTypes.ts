import { User } from "@prisma/client";

export type Symptom = {
  id: number;
  name: string;
};

export type SymptomAnswer = {
  symptom: string;
  duration: number;
  unit: string;
  isOther: boolean;
};

export type Activity = {
  id: string;
  patientId: string;
  dateTime: string;
  prediction: string;
  status: string;
  notes: string;
  symptoms: ({ type: string } & Omit<SymptomAnswer, "isOther">)[];
  patient: Omit<User, "id" | "createdAt" | "updatedAt">;
  // patient: {
  //   name: string;
  //   dateOfBirth: string;
  //   height: number;
  //   weight: number;
  //   email: string;
  //   phone: string;
  //   chronicDisease: string;
  //   allergies: string;
  // };
};
