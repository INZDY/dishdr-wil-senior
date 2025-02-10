"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FormData } from "@/types/formTypes";
import PersonalInfo from "./components/PersonalInfo";
import SymptomSelection from "./components/SymptomSelection";
import SymptomInquiry from "./components/SymptomInquiry";
import ResultBooking from "./components/ResultBooking";
import Summary from "./components/Summary";

import { useTranslation } from "@/app/i18n/client";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function MakeAppointment({ params }: { params: any }) {
  const { data: session } = useSession();
  const { lng } = React.use<{ lng: string }>(params);
  const { t } = useTranslation(lng, "make-appointment");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"next" | "back">("next");
  const [formData, setFormData] = useState<FormData>({
    sessionId: session?.user?.id as string,
    name: "",
    hn: "",
    dateOfBirth: "",
    height: 0,
    weight: 0,
    email: "",
    phone: "",
    chronicDiseases: "",
    allergies: "",

    department: "",
    dateTime: undefined,
    status: "pending",

    careType: "",
    chiefComplaint: { symptom: "", duration: 0, unit: "", isOther: false },
    presentIllness: [],
    inquiries: [],
    predicted: false,
    prediction: "",

    notes: "",
  });

  const handleNext = () => {
    if (step === 2) {
      if (formData.careType === "scheduled") {
        // skip to step 4
        setStep((prevStep) => prevStep + 1);
      } else if (formData.careType === "symptoms") {
        // TODO: should be able to do this in symptom selection
        setFormData({
          ...formData,
          inquiries: [
            {
              type: "chief",
              symptom: formData.chiefComplaint.symptom,
              duration: formData.chiefComplaint.duration,
              unit: formData.chiefComplaint.unit,
              hasSymptom: true,
              isOther: formData.chiefComplaint.isOther,
            },
            ...formData.presentIllness.map((illness) => {
              return {
                type: "present",
                symptom: illness.symptom,
                duration: illness.duration,
                unit: illness.unit,
                hasSymptom: true,
                isOther: illness.isOther,
              };
            }),
          ],
        });
        if (
          formData.chiefComplaint.isOther &&
          formData.presentIllness.every((illness) => illness.isOther)
        ) {
          // skip to step 4
          setStep((prevStep) => prevStep + 1);
        }
      }
    }
    if (step === 3) {
      setFormData({ ...formData, predicted: true });
    }
    setDirection("next");
    setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    if (
      step == 4 &&
      formData.chiefComplaint.isOther &&
      formData.presentIllness.every((illness) => illness.isOther)
    ) {
      // skip to 2
      setStep((prevStep) => prevStep - 1);
    }
    setDirection("back");
    setStep((prevStep) => prevStep - 1);
  };

  const handleConfirmAppointment = async () => {
    setLoading(true);
    console.log("Confirming appointment", formData);
    // send appointment data to the server
    try {
      const response = await fetch("/api/new-appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to confirm appointment");
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error confirming appointment:", error);
    } finally {
      setLoading(false);
      toast.success("New appointment is created");
      handleNext();
    }
  };

  const handleNavigate = () => router.push("/activity");

  const handleSaveToDevice = () => {
    console.log("Save to device");
  };

  if (loading) {
    return (
      <p className="flex justify-center font-lg text-bold text-white">
        Loading...
      </p>
    );
  }

  if (!session) {
    router.push("/");
  }

  return (
    <div className="max-w-screen-lg mx-auto my-12 p-4 bg-white shadow rounded">
      {step === 1 && (
        <PersonalInfo formData={formData} setFormData={setFormData} lng={lng} />
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
            disabled
            onClick={() => {
              handleSaveToDevice;
            }}
          >
            {t("save-to-device")}
            {/* Save to device */}
          </Button>
        )}

        {/* navigation */}
        <div className="flex flex-grow justify-end gap-4">
          {step == 2 && (
            <Button
              onClick={handleBack}
              variant={"secondary"}
              className="px-4 py-2 bg-gray-300 text-base"
            >
              {t("back")}
            </Button>
          )}
          {step < 3 && (
            <Button onClick={handleNext} className="px-4 py-2 text-base">
              {t("next")}
              {/* Next */}
            </Button>
          )}
          {step == 4 && (
            <Button
              onClick={handleConfirmAppointment}
              className="px-4 py-2 text-base"
            >
              {t("confirm")}
              {/* Confirm */}
            </Button>
          )}
          {step == 5 && (
            <Button onClick={handleNavigate} className="px-4 py-2 text-base">
              {t("confirm")}
              {/* Confirm */}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
