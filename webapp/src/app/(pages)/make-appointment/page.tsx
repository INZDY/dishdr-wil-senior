"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FormData } from "@/types/formTypes";
import PersonalInfo from "./components/PersonalInfo";
import SymptomSelection from "./components/SymptomSelection";
import SymptomInquiry from "./components/SymptomInquiry";
import ResultBooking from "./components/ResultBooking";
import Summary from "./components/Summary";

export default function MakeAppointment() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"next" | "back">("next");
  const [formData, setFormData] = useState<FormData>({
    // sessionId = userId
    sessionId: "JohnDoeId",
    name: "",
    dateOfBirth: "",
    height: 0,
    weight: 0,
    email: "",
    phone: "",
    chronicDiseases: "",
    allergies: "",

    department: "",
    date: "",
    time: "",
    status: null,

    symptoms: [],
    chiefComplaint: { symptom: "", duration: 0, unit: "" },
    presentIllness: [],
    inquiries: [],
    predicted: false,
    prediction: "",

    notes: "",
  });

  const handleNext = () => {
    if (step === 2) {
      setFormData({
        ...formData,
        symptoms: [
          formData.chiefComplaint.symptom,
          ...formData.presentIllness.map((illness) => illness.symptom),
        ],
      });
      console.log(formData);
    }
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
    <div className="max-w-screen-lg mx-auto my-12 p-4 bg-white shadow rounded">
      {step === 1 && (
        <PersonalInfo formData={formData} setFormData={setFormData} />
      )}
      {step === 2 && (
        <SymptomSelection formData={formData} setFormData={setFormData} />
      )}
      {step === 3 && (
        <SymptomInquiry
          formData={formData}
          setFormData={setFormData}
          handleNext={handleNext}
          handleBack={handleBack}
          direction={direction}
        />
      )}
      {step === 4 && (
        <ResultBooking formData={formData} setFormData={setFormData} />
      )}
      {step === 5 && <Summary formData={formData} />}

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
          {(step == 2 || step == 4) && (
            <Button
              onClick={handleBack}
              variant={"secondary"}
              className="px-4 py-2 bg-gray-300 text-base"
            >
              Back
            </Button>
          )}
          {step < 3 && (
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
