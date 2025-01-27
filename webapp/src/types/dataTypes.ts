export type Symptom = {
  id: number;
  name: string;
};

export type SymptomAnswer = {
  symptom: string;
  duration: number;
  unit: string;
};

export type Activity = {
  id: string;
  patientId: string;
  dateTime: string;
  prediction: string;
  status: string;
  notes: string;
  symptoms: ({ type: string } & SymptomAnswer)[];
  patient: {
    name: string;
    dateOfBirth: string;
    height: number;
    weight: number;
    email: string;
    phone: string;
    chronicDisease: string;
    allergies: string;
  };
};
