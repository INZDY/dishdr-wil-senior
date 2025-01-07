"use client";

import React, { useState } from "react";
import {
  FormData,
  Step1,
  Step2,
  Step3,
  Step4,
  Step5,
} from "./components/Forms";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function MakeAppointment() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"next" | "back">("next");
  // const [isPredicted, setIsPredicted] = useState(false);
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
    symptoms: [],
    inquiries: [],
    predicted: false,
    prediction: "",
    notes: "",
  });

  const handleNext = () => {
    if (step === 3) {
      setFormData({ ...formData, predicted: true });
    }
    setDirection("next");
    setStep((prevStep) => prevStep + 1);
  };
  const handleBack = () => {
    setDirection("back");
    setStep((prevStep) => prevStep - 1);
  };

  const handleSubmitAppointment = () => {
    console.log("Appointment submitted");
    handleNext();
  };

  const handleNavigate = () => router.push("/activity");

  const handleSaveToDevice = () => {
    console.log("Save to device");
  };

  return (
    <div className="max-w-lg mx-auto my-12 p-4 bg-white shadow rounded">
      {step === 1 && <Step1 formData={formData} setFormData={setFormData} />}
      {step === 2 && <Step2 formData={formData} setFormData={setFormData} />}
      {step === 3 && (
        <Step3
          formData={formData}
          setFormData={setFormData}
          handleNext={handleNext}
          handleBack={handleBack}
          direction={direction}
        />
      )}
      {step === 4 && <Step4 formData={formData} setFormData={setFormData} />}
      {step === 5 && <Step5 formData={formData} />}

      {/* bottom section */}
      <div className="flex mt-6 items-center">
        {step === 5 && (
          <Button
            onClick={() => {
              handleSaveToDevice;
            }}
          >
            Save to device
          </Button>
        )}

        {/* navigation */}
        <div className="flex flex-grow justify-end gap-4">
          {step > 1 && step < 5 && step !== 3 && (
            <Button
              onClick={handleBack}
              variant={"secondary"}
              className="px-4 py-2 bg-gray-300 text-base"
            >
              Back
            </Button>
          )}
          {step < 4 && step !== 3 && (
            <Button onClick={handleNext} className="px-4 py-2 text-base">
              Next
            </Button>
          )}
          {step == 4 && (
            <Button
              onClick={handleSubmitAppointment}
              className="px-4 py-2 text-base"
            >
              Confirm
            </Button>
          )}
          {step == 5 && (
            <Button onClick={handleNavigate} className="px-4 py-2 text-base">
              Confirm
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
