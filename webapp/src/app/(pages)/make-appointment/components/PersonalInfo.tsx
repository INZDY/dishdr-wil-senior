import React from "react";
import { StepProps } from "@/types/formTypes";
import { Input } from "@/components/ui/input";

export default function PersonalInfo({ formData, setFormData }: StepProps) {
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

        <div>
          <p className="mb-1 font-semibold">Chronic diseases</p>
          <Input
            type="text"
            value={formData.chronicDiseases}
            onChange={(e) =>
              setFormData({ ...formData, chronicDiseases: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <p className="mb-1 font-semibold">Allergies</p>
          <Input
            type="text"
            value={formData.allergies}
            onChange={(e) =>
              setFormData({ ...formData, allergies: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
          />
        </div>
      </div>
    </div>
  );
}
