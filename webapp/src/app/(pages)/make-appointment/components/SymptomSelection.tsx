import React, { useEffect, useState } from "react";
import { StepProps } from "@/types/formTypes";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FaCheck, FaChevronDown } from "react-icons/fa6";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { symptomList } from "@/types/dataTypes";
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

export default function SymptomSelection({ formData, setFormData }: StepProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [symptomList, setSymptomList] = useState<
    { value: string; label: string }[]
  >([]);

  const [symptomDetails, setSymptomDetails] = useState<{
    symptom: string;
    duration: number;
    unit: string;
  }>();

  const [chiefComplaint, setChiefComplaint] = useState<{
    symptom: string;
    duration: number;
    unit: string;
  }>();

  const [presentIllness, setPresentIllness] = useState<
    {
      symptom: string;
      duration: number;
      unit: string;
    }[]
  >();

  const commonSymptoms = ["Headache", "Fever", "Cough", "Sore Throat"];

  useEffect(() => {
    async function fetchSymptoms() {
      const response = await fetch("/api/actions/symptom-list");

      if (!response.ok) {
        throw new Error("Failed to get symptom list from server");
      }

      const data: symptomList = await response.json();

      // need to transform label format
      setSymptomList(
        data.map((symptom) => ({
          value: symptom.name,
          label: symptom.name,
        }))
      );
    }
    fetchSymptoms();
  }, []);

  const handleSymptomSelect = (symptom: string) => {
    if (!formData.symptoms.includes(symptom)) {
      setFormData({ ...formData, symptoms: [...formData.symptoms, symptom] });
    }
  };

  const handleSymptomRemove = (symptom: string) => {
    setFormData({
      ...formData,
      symptoms: formData.symptoms.filter((s) => s !== symptom),
    });
  };

  const handleDropdownSelect = (symptom: string) => {
    setOpen(false);
    setDialogOpen(true);
    setSymptomDetails({ symptom, duration: 0, unit: "days" });
  };

  // const handleCustomSymptomAdd = () => {
  //   if (customSymptom && !formData.symptoms.includes(customSymptom)) {
  //     setFormData({
  //       ...formData,
  //       symptoms: [...formData.symptoms, customSymptom],
  //     });
  //     setCustomSymptom("");
  //   }
  // };

  return (
    <>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">Preliminary Symptoms</h2>
        <div className="flex border-t-2 border-gray-400 rounded" />

        {/* Chief complaint */}
        <div className="flex flex-col gap-2">
          <h3 className="mb-1 font-semibold">Chief complaint</h3>
          <p className="text-sm text-gray-500">
            Symptom that makes you seek medical attention.
          </p>

          {/* symptom selection list with dropdown menu */}
          <div className="flex gap-4 items-center">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between"
                >
                  {value
                    ? value == "other"
                      ? "Other..."
                      : symptomList.find((symptom) => symptom.value === value)
                          ?.label
                    : "Select symptoms..."}
                  <FaChevronDown className="opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search symptom..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No symptom found.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        key="other"
                        value="other"
                        onSelect={(currentValue: string) => {
                          setValue(currentValue === value ? "" : currentValue);
                          handleDropdownSelect(currentValue);
                        }}
                      >
                        {"Other..."}
                        <FaCheck
                          className={cn(
                            "ml-auto",
                            value === "other" ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>

                      {symptomList.map((symptom) => (
                        <CommandItem
                          key={symptom.value}
                          value={symptom.value}
                          onSelect={(currentValue: string) => {
                            setValue(
                              currentValue === value ? "" : currentValue
                            );
                            handleDropdownSelect(currentValue);
                          }}
                        >
                          {symptom.label}
                          <FaCheck
                            className={cn(
                              "ml-auto",
                              value === symptom.value
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
            <p>2</p>
            <p>day(s)</p>
          </div>
        </div>

        {/* Present Illness */}
        <div className="flex flex-col gap-2">
          <h3 className="mb-1 font-semibold">Present illness</h3>
          <p className="text-sm text-gray-500">
            Other symptoms that you are experiencing.
          </p>
        </div>

        {/* Display selected symptoms as tags */}
        {/* <div className="flex flex-wrap gap-2 mt-2">
          {formData.symptoms.map((symptom, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-200 p-2 rounded-md"
            >
              {symptom}
              <button
                onClick={() => handleSymptomRemove(symptom)}
                className="ml-1 px-1 rounded-md text-red-500 hover:bg-neutral-300 transition-all"
              >
                &times;
              </button>
            </div>
          ))}
        </div> */}

        {/* Common symptoms selection */}
        {/* <div className="mt-4">
          <h3 className="text-sm font-semibold">Common Symptoms</h3>
          <div className="flex flex-wrap gap-4 mt-2">
            {commonSymptoms.map((symptom, index) => (
              <Button
                key={index}
                // onClick={() => handleSymptomSelect(symptom)}
                className="text-black bg-gray-200 p-2 rounded-md"
              >
                {symptom}
              </Button>
            ))}
          </div>
        </div> */}
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
                disabled={symptomDetails?.symptom !== "other"}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duration
              </Label>
              <Input id="duration" defaultValue={symptomDetails?.duration} />
              <Select>
                <SelectTrigger className="">
                  <SelectValue placeholder="day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">day</SelectItem>
                  <SelectItem value="hour">hour</SelectItem>
                  <SelectItem value="minute">minute</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
