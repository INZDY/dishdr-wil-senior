import { SymptomList } from "@/types/dataTypes";

export const valueToLabel = (symptomList: SymptomList) => {
  const valueLabel = symptomList.map((symptom) => {
    const readable = symptom.name
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
    return { value: symptom.name, label: readable };
  });

  return valueLabel;
};

export const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const sortPresentIllness = (
  a: { symptom: string; duration: number; unit: string },
  b: { symptom: string; duration: number; unit: string }
) => {
  // const order = { day: 1, hour: 2, minute: 3 };
  return a.unit.localeCompare(b.unit) || b.duration - a.duration;
};
