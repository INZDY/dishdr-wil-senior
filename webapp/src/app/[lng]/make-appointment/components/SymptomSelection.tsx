import React, { useEffect, useState } from "react";
import { StepProps } from "@/types/formTypes";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FaCheck, FaChevronDown, FaRegTrashCan } from "react-icons/fa6";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Symptom, SymptomAnswer } from "@/types/dataTypes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sortPresentIllness, valueToLabel } from "@/utils/utils";

export default function SymptomSelection({ formData, setFormData }: StepProps) {
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
        <h2 className="text-xl font-bold">Preliminary Symptoms</h2>
        <div className="flex border-t-2 border-gray-400 rounded" />

        {/* Chief complaint */}
        <div className="flex flex-col gap-2">
          <h3 className="mb-1 font-semibold">Chief complaint</h3>
          <p className="text-sm text-gray-500">
            Symptom that makes you seek medical attention. (only 1)
          </p>

          {/* symptom selection list with dropdown menu */}
          <Popover open={chiefOpen} onOpenChange={setChiefOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={chiefOpen}
                className="w-[200px] justify-between"
              >
                {chiefValue
                  ? chiefValue == "other"
                    ? "Other..."
                    : symptomList.find(
                        (symptom) => symptom.value === chiefValue
                      )?.label
                  : "Select symptoms..."}
                <FaChevronDown className="opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search symptom..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No symptom found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      key="other"
                      value="other"
                      onSelect={(currentValue: string) => {
                        setChiefValue(
                          currentValue === chiefValue ? "" : currentValue
                        );
                        handleDropdownSelect(currentValue, "chief");
                      }}
                    >
                      {"Other..."}
                      <FaCheck
                        className={cn(
                          "ml-auto",
                          chiefValue === "other" ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>

                    {symptomList.map((symptom) => (
                      <CommandItem
                        key={symptom.value}
                        value={symptom.value}
                        onSelect={(currentValue: string) => {
                          setChiefValue(
                            currentValue === chiefValue ? "" : currentValue
                          );
                          handleDropdownSelect(currentValue, "chief");
                        }}
                      >
                        {symptom.label}
                        <FaCheck
                          className={cn(
                            "ml-auto",
                            chiefValue === symptom.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <div className="flex">
            {formData.chiefComplaint.unit !== "" ? (
              <div className="flex gap-2 h-10 p-2 items-center rounded-md bg-red-200 shadow-sm">
                <p className="flex gap-2">
                  <span>{formData.chiefComplaint?.symptom}:</span>
                  <span>{formData.chiefComplaint?.duration}</span>
                  <span>{formData.chiefComplaint?.unit}</span>
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Present Illness */}
        <div className="flex flex-col gap-2">
          <h3 className="mb-1 font-semibold">Present illness</h3>
          <p className="text-sm text-gray-500">
            Other symptoms that you are experiencing.
          </p>

          <Popover open={presentOpen} onOpenChange={setPresentOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={presentOpen}
                className="w-[200px] justify-between"
              >
                {presentValue
                  ? presentValue == "other"
                    ? "Other..."
                    : symptomList.find(
                        (symptom) => symptom.value === presentValue
                      )?.label
                  : "Select symptoms..."}
                <FaChevronDown className="opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search symptom..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No symptom found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      key="other"
                      value="other"
                      onSelect={(currentValue: string) => {
                        setPresentValue(
                          currentValue === presentValue ? "" : currentValue
                        );
                        handleDropdownSelect(currentValue, "present");
                      }}
                    >
                      {"Other..."}
                      <FaCheck
                        className={cn(
                          "ml-auto",
                          presentValue === "other" ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>

                    {symptomList.map((symptom) => (
                      <CommandItem
                        key={symptom.value}
                        value={symptom.value}
                        onSelect={(currentValue: string) => {
                          setPresentValue(
                            currentValue === presentValue ? "" : currentValue
                          );
                          handleDropdownSelect(currentValue, "present");
                        }}
                      >
                        {symptom.label}
                        <FaCheck
                          className={cn(
                            "ml-auto",
                            presentValue === symptom.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <div className="flex">
            <div className="flex flex-col gap-2 justify-center">
              {formData.presentIllness.map((symptom, index) => (
                <div
                  key={index}
                  className="flex gap-2 h-10 p-2 items-center justify-between rounded-md bg-green-200 shadow-sm"
                >
                  <p className="flex gap-2">
                    <span>{symptom.symptom}:</span>
                    <span>{symptom.duration}</span>
                    <span>{symptom.unit}</span>
                  </p>
                  <Button
                    onClick={() => handleDeletePresentIllness(index)}
                    className="bg-transparent px-1 hover:bg-neutral-200 shadow-none"
                  >
                    <FaRegTrashCan color="red" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Symptom Details</DialogTitle>
            <DialogDescription>
              Fill details for the selected symptom.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="symptom" className="text-right">
                Symptom
              </Label>
              <Input
                id="symptom"
                defaultValue={symptomDetails?.symptom}
                disabled={
                  selectionType === "chief"
                    ? chiefValue !== "other"
                    : presentValue !== "other"
                }
                onChange={(e) => {
                  symptomDetails != undefined
                    ? setSymptomDetails({
                        ...symptomDetails,
                        symptom: e.target.value,
                      })
                    : null;
                }}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duration
              </Label>
              <Input
                id="duration"
                defaultValue={symptomDetails?.duration}
                onChange={(e) => {
                  symptomDetails != undefined
                    ? setSymptomDetails({
                        ...symptomDetails,
                        duration: parseInt(e.target.value),
                      })
                    : null;
                }}
              />
              <Select
                onValueChange={(unit) => {
                  symptomDetails != undefined
                    ? setSymptomDetails({ ...symptomDetails, unit: unit })
                    : null;
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="days" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="days">days</SelectItem>
                  <SelectItem value="hours">hours</SelectItem>
                  <SelectItem value="minutes">minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSaveChanges}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
