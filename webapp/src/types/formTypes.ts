import { AppointmentSymptoms } from "@prisma/client";
import { SymptomAnswer } from "./dataTypes";

// inquiries: should be list of {question, answer}
export interface FormData {
  sessionId: string;
  name: string;
  dateOfBirth: string;
  height: number;
  weight: number;
  email: string;
  phone: string;
  // patientId: string;
  chronicDiseases: string;
  allergies: string;

  department: string;
  date: string;
  time: string;
  status: string | null;

  careType: string;
  chiefComplaint: SymptomAnswer;
  presentIllness: SymptomAnswer[];
  inquiries: Omit<AppointmentSymptoms, "id" | "appointmentId">[];
  predicted: boolean;
  prediction: string;

  notes: string;
  // bookingDetails: { confirmed: boolean } | null;
}

export interface StepProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  direction?: "next" | "back";
  handleNext?: () => void;
  handleBack?: () => void;
}
