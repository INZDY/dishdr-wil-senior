import { AppointmentSymptoms } from "@prisma/client";
import { SymptomAnswer } from "./dataTypes";

// inquiries: should be list of {question, answer}
export interface FormData {
  sessionId: string;
  name: string;
  hn: string;
  dateOfBirth: string;
  height: number;
  weight: number;
  email: string;
  phone: string;
  chronicDiseases: string;
  allergies: string;

  department: string;
  dateTime: Date | undefined;
  status: string | null;

  careType: string;
  chiefComplaint: SymptomAnswer;
  presentIllness: SymptomAnswer[];
  inquiries: (Omit<AppointmentSymptoms, "id" | "appointmentId"> & {
    code: string;
  })[];
  predicted: boolean;
  prediction: string;

  notes: string;
}

export interface StepProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  direction?: "next" | "back";
  handleNext?: () => void;
  handleBack?: () => void;
}
