import { Appointment, Department, Profile, User } from "@prisma/client";

export type Symptom = {
  id: number;
  name: string;
};

export type SymptomAnswer = {
  code: string;
  name: string;
  // symptom: string;
  duration: number;
  unit: string;
  isOther: boolean;
};

export type FetchedCookieData = {
  name?: string;
  hn?: string;
  phone?: string;
  email?: string;
};

export type Activity = Appointment & {
  symptoms: ({ type: string } & Omit<SymptomAnswer, "isOther">)[];
  // user: { profile: Omit<Profile, "id" | "userId" | "createdAt" | "updatedAt"> };
};

export type DepartmentFull = Department & {
  departmentSchedules: { dayOfWeek: number; enabled: boolean }[];
};
