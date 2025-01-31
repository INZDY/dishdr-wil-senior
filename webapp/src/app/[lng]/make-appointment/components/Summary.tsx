import { FormData } from "@/types/formTypes";
import React from "react";

export default function Summary({ formData }: { formData: FormData }) {
  console.log("formData", formData);
  const appointmentInfo = {
    appointmentId: "1234567890",
    name: "Jonh Doe",
    department: "Cardiology",
    departmentDesc: "Floor xx, yy Building",
    date: "2022-01-01",
    time: "10:00",
    status: "confirmed",
    notes: "I have past medical records.",
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Booking Details</h2>
      <div className="flex border-t-2 border-gray-400 rounded" />
      {/* Summary Section */}
      <div className="flex flex-col gap-4 bg-gray-100 p-4 rounded shadow">
        {/* <p className="flex p-4 justify-center bg-teal-300 border-2 border-black rounded-md text-2xl font-bold">
          {appointmentInfo.department}
        </p> */}
        <p>Name: {formData.name}</p>
        <p>Date: {formData.date}</p>
        <p>Time: {formData.time}</p>
        <p>Notes: {formData.notes}</p>
        <p>Status: {formData.status}</p>
      </div>
    </div>
  );
}
