import React, { useEffect, useState } from "react";
import { StepProps } from "@/types/formTypes";
import { Symptom, SymptomAnswer } from "@/types/dataTypes";
import { Label } from "@/components/ui/label";
import { sortPresentIllness, valueToLabel } from "@/utils/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import SymptomDialog from "./symptom-select/SymptomDialog";
import SymptomSelect from "./symptom-select/SymptomSelect";

export default function SymptomSelection({ formData, setFormData }: StepProps) {
  // const [reason, setReason] = useState("");
  const [chiefOpen, setChiefOpen] = useState(false);
  const [presentOpen, setPresentOpen] = useState(false);
  const [chiefValue, setChiefValue] = useState("");
  const [presentValue, setPresentValue] = useState("");
  const [selectionType, setSelectionType] = useState<"chief" | "present">(
    "chief"
  );

  const [dialogOpen, setDialogOpen] = useState(false);

  const [symptomList, setSymptomList] = useState<
    { value: string; label: string }[]
  >([]);

  const [symptomDetails, setSymptomDetails] = useState<SymptomAnswer>();

  useEffect(() => {
    async function fetchSymptoms() {
      const response = await fetch("/api/actions/symptom-list");

      if (!response.ok) {
        throw new Error("Failed to get symptom list from server");
      }

      const data: Symptom[] = await response.json();

      // need to transform label format
      const symptoms = valueToLabel(data);
      setSymptomList(symptoms);
    }
    fetchSymptoms();
  }, []);

  const handleSelectCareType = (careType: string) => {
    setFormData({ ...formData, careType: careType });
  };

  const handleDropdownSelect = (symptom: string, type: "chief" | "present") => {
    setSelectionType(type);

    // if user select 'other', dont dount
    setSymptomDetails({
      symptom,
      duration: 0,
      unit: "days",
      isOther: symptom === "other",
    });

    setChiefOpen(false);
    setPresentOpen(false);
    setDialogOpen(true);
  };

  const handleSaveChanges = () => {
    if (selectionType === "chief") {
      setFormData({ ...formData, chiefComplaint: symptomDetails! });
    } else {
      const existingIndex = formData.presentIllness.findIndex(
        (symptom) => symptom.symptom === symptomDetails?.symptom
      );

      if (existingIndex !== -1) {
        // Replace the existing symptom
        const updatedPresentIllness = [...formData.presentIllness];
        updatedPresentIllness[existingIndex] = symptomDetails!;
        setFormData({
          ...formData,
          presentIllness: updatedPresentIllness.sort(sortPresentIllness),
        });
      } else {
        // Add new symptom
        setFormData({
          ...formData,
          presentIllness: [...formData.presentIllness, symptomDetails!].sort(
            sortPresentIllness
          ),
        });
      }
    }
    setChiefValue("");
    setPresentValue("");
    setSymptomDetails(undefined);
    setDialogOpen(false);
  };

  const handleDeletePresentIllness = (index: number) => {
    setFormData({
      ...formData,
      presentIllness: formData.presentIllness.filter((_, i) => i !== index),
    });
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">Purpose of Appointment</h2>
        <div className="flex border-t-2 border-gray-400 rounded" />
        <p className="text-sm text-gray-500">
          Please select the reason for your visit.
          <span className="text-red-500">*</span>
        </p>

        <RadioGroup onValueChange={(value) => handleSelectCareType(value)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="scheduled" id="scheduled" />
            <Label htmlFor="scheduled">Scheduled Appointment/Follow-Up</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="symptoms" id="symptoms" />
            <Label htmlFor="symptoms">Experiencing Symptoms</Label>
          </div>
        </RadioGroup>

        {formData.careType === "symptoms" && (
          <SymptomSelect
            chiefOpen={chiefOpen}
            setChiefOpen={setChiefOpen}
            chiefValue={chiefValue}
            setChiefValue={setChiefValue}
            presentOpen={presentOpen}
            setPresentOpen={setPresentOpen}
            presentValue={presentValue}
            setPresentValue={setPresentValue}
            symptomList={symptomList}
            handleDropdownSelect={handleDropdownSelect}
            handleDeletePresentIllness={handleDeletePresentIllness}
            formData={formData}
          />
        )}
      </div>

      <SymptomDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        symptomDetails={symptomDetails}
        setSymptomDetails={setSymptomDetails}
        selectionType={selectionType}
        chiefValue={chiefValue}
        presentValue={presentValue}
        handleSaveChanges={handleSaveChanges}
      />
    </>
  );
}
