export type Symptom = {
  id: number;
  name: string;
};

export type SymptomList = Symptom[];

export type SymptomAnswer = {
  symptom: string;
  duration: number;
  unit: string;
}