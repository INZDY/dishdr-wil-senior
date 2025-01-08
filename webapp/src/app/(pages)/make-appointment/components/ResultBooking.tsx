import { Button } from "@/components/ui/button";
import { StepProps } from "@/types/formTypes";
import React, { useState } from "react";

export default function ResultBooking({ formData, setFormData }: StepProps) {
  const [showFullResults, setShowFullResults] = useState(false);

  const predictionResults = [
    { department: "Cardiology", percentage: 80 },
    { department: "Neurology", percentage: 70 },
    { department: "Orthopedics", percentage: 60 },
    { department: "General Purpose", percentage: 50 },
  ];

  const topPrediction = predictionResults[0];

  const handleExpandResults = () => {
    setShowFullResults(!showFullResults);
  };

  const handleDepartmentChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFormData({ ...formData, department: event.target.value });
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, date: event.target.value });
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, time: event.target.value });
  };

  const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, notes: event.target.value });
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Result and Appointment Booking</h2>
      <div className="flex border-t-2 border-gray-400 rounded" />

      {/* Prediction Result Section */}
      <div className="bg-gray-100 p-4 rounded shadow">
        <h3 className="text-lg font-semibold">Prediction Result</h3>
        <p>
          Top Prediction: {topPrediction.department} ({topPrediction.percentage}
          %)
        </p>
        <Button onClick={handleExpandResults} className="mt-2">
          {showFullResults ? "Hide Full Results" : "Show Full Results"}
        </Button>
        {showFullResults && (
          <ul className="mt-2">
            {predictionResults.map((result, index) => (
              <li key={index}>
                {result.department}: {result.percentage}%
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Make Appointment Section */}
      <div className="bg-gray-100 p-4 rounded shadow mt-4">
        <h3 className="text-lg font-semibold">Make Appointment</h3>
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700">
            Department
          </label>
          <select
            value={formData.department}
            onChange={handleDepartmentChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            {predictionResults.map((result, index) => (
              <option key={index} value={result.department}>
                {result.department}
              </option>
            ))}
            <option value="General Purpose">General Purpose</option>
          </select>
        </div>
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={handleDateChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700">
            Time
          </label>
          <input
            type="time"
            value={formData.time}
            onChange={handleTimeChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700">
            Additional Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={handleNotesChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            rows={3}
          ></textarea>
        </div>
      </div>
    </div>
  );
}
