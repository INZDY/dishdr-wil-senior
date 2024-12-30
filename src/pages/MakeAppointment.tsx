import React, { useState } from "react";
import {
  FormData,
  Step1,
  Step2,
  Step3,
  Step4,
  Step5,
} from "../components/Forms";
import { Button } from "@/components/ui/button";

export default function MakeAppointment() {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    dateOfBirth: "",
    height: 0,
    weight: 0,
    email: "",
    phone: "",
    department: "",
    date: "",
    time: "",
    status: null,
    symptoms: "",
    inquiries: [],
    prediction: "",
  });

  const handleNext = () => setStep((prevStep) => prevStep + 1);
  const handleBack = () => setStep((prevStep) => prevStep - 1);

  return (
    <div className="max-w-lg mx-auto my-12 p-4 bg-white shadow rounded">
      {step === 1 && <Step1 formData={formData} setFormData={setFormData} />}
      {step === 2 && <Step2 formData={formData} setFormData={setFormData} />}
      {step === 3 && <Step3 formData={formData} setFormData={setFormData} />}
      {step === 4 && <Step4 formData={formData} setFormData={setFormData} />}
      {step === 5 && <Step5 formData={formData} />}
      <div className="flex justify-end gap-4 mt-6">
        {step > 1 && (
          <Button
            onClick={handleBack}
            variant={"secondary"}
            className="px-4 py-2 bg-gray-300 text-base"
          >
            Back
          </Button>
        )}
        {step < 5 && (
          <Button onClick={handleNext} className="px-4 py-2 text-base">
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
