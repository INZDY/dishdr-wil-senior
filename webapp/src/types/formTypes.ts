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

  symptoms: string[];
  inquiries: string[];
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