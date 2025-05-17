import { DepartmentFull } from "@/types/dataTypes";
import { addMinutes, format, parse } from "date-fns";

// This is for departmenmt, leaving as is because it does not break
export const convertToSelect = (deptList: DepartmentFull[]) => {
  return deptList.map((dept) => {
    return {
      value: dept.name,
      label: dept.name,
      labelTh: dept.nameTh,
    };
  });
};

export const sortPresentIllness = (
  a: { code: string; symptom: string; duration: number; unit: string },
  b: { code: string; symptom: string; duration: number; unit: string }
) => {
  // const order = { day: 1, hour: 2, minute: 3 };
  return a.unit.localeCompare(b.unit) || b.duration - a.duration;
};

export const generateTimeOptions = (start: string, end: string) => {
  const times: string[] = [];
  let currentTime = parse(start, "HH:mm", new Date());
  const endTime = parse(end, "HH:mm", new Date());

  while (currentTime <= endTime) {
    times.push(format(currentTime, "HH:mm"));
    currentTime = addMinutes(currentTime, 30);
  }

  return times;
};

export const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
