import React from "react";
import { Input } from "./ui/input";

export interface FormData {
  name: string;
  dateOfBirth: string;
  height: number;
  weight: number;
  email: string;
  phone: string;
  // patientId: string;

  department: string;
  date: string;
  time: string;
  status: string | null;

  symptoms: string;
  inquiries: string[];
  prediction: string;
  // bookingDetails: { confirmed: boolean } | null;
}

interface StepProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export function Step1({ formData, setFormData }: StepProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Patient Information</h2>
      <div className="flex border-t-2 border-gray-400 rounded" />
      <div className="flex flex-col gap-4">
        <div>
          <p className="mb-1 font-semibold">Name</p>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <p className="mb-1 font-semibold">Date of birth</p>
          <Input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) =>
              setFormData({ ...formData, dateOfBirth: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <p className="mb-1 font-semibold">Height (cm)</p>
          <Input
            type="number"
            value={formData.height}
            onChange={(e) =>
              setFormData({ ...formData, height: parseInt(e.target.value) })
            }
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <p className="mb-1 font-semibold">Weight (kg)</p>
          <Input
            type="number"
            value={formData.weight}
            onChange={(e) =>
              setFormData({ ...formData, weight: parseInt(e.target.value) })
            }
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <p className="mb-1 font-semibold">Email</p>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <p className="mb-1 font-semibold">Phone number</p>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* <input
        type="text"
        value={formData.patientId}
        onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
        className="w-full px-3 py-2 border rounded"
      /> */}
      </div>
    </div>
  );
}

export function Step2({ formData, setFormData }: StepProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold mb-4">Preliminary Symptoms</h2>
      <div className="flex border-t-2 border-gray-400 rounded" />
      <textarea
        placeholder="Describe your symptoms briefly"
        value={formData.symptoms}
        onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
        className="w-full px-3 py-2 border rounded"
        rows={4}
        required
      ></textarea>
    </div>
  );
}

export function Step3({ formData, setFormData }: StepProps) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Inquiries</h2>
      <div>
        <label>
          <input
            type="checkbox"
            checked={formData.inquiries.includes("availability")}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                inquiries: e.target.checked
                  ? [...prev.inquiries, "availability"]
                  : prev.inquiries.filter((i) => i !== "availability"),
              }))
            }
          />
          Availability
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={formData.inquiries.includes("pricing")}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                inquiries: e.target.checked
                  ? [...prev.inquiries, "pricing"]
                  : prev.inquiries.filter((i) => i !== "pricing"),
              }))
            }
          />
          Pricing
        </label>
      </div>
    </div>
  );
}

export function Step4({ formData, setFormData }: StepProps) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Prediction</h2>
      <input
        type="text"
        placeholder="Prediction"
        value={formData.prediction}
        onChange={(e) =>
          setFormData({ ...formData, prediction: e.target.value })
        }
        className="w-full px-3 py-2 border rounded"
      />
    </div>
  );
}

export function Step5({ formData }: { formData: FormData }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Booking Details</h2>
      {/* {formData.bookingDetails ? (
        <p>
          {formData.bookingDetails.confirmed
            ? "Booking confirmed!"
            : "Booking pending."}
        </p>
      ) : (
        <p>No booking details.</p>
      )} */}
    </div>
  );
}
