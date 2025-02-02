import { Appointment, User } from "@prisma/client";

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

export type Activity = Appointment & {
  symptoms: ({ type: string } & Omit<SymptomAnswer, "isOther">)[];
  patient: Omit<User, "id" | "createdAt" | "updatedAt">;
  // id: string;
  // appointmentName: string;
  // patientId: string;
  // dateTime: string;
  // department: string;
  // prediction: string;
  // status: string;
  // notes: string;

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
