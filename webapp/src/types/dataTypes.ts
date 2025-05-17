import { Appointment, Department } from "@prisma/client";

export type Symptom = {
  id: number;
  name: string;
};

export type SymptomAnswer = {
  type: string;
  code: string;
  symptom: string;
  symptomTh: string;
  duration: number;
  unit: string;
  hasSymptom: boolean;
  isOther: boolean;
};

export type FetchedCookieData = {
  name?: string;
  hn?: string;
  phone?: string;
  email?: string;
};

export type Activity = Appointment & {
  symptoms: Omit<SymptomAnswer, "isOther">[];
};

export type DepartmentFull = Department & {
  departmentSchedules: { dayOfWeek: number; enabled: boolean }[];
};
