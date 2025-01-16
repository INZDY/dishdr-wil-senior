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
                <CommandInput placeholder="Search symptom..." className="h-9" />
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
                          setValue(currentValue === value ? "" : currentValue);
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
          <div className="flex">
            <div className="flex gap-2 h-10 p-2 items-center rounded-md bg-red-200 shadow-sm">
              <p className="flex gap-2">
                <span>{symptomDetails?.symptom}:</span>
                <span>{symptomDetails?.duration}</span>
                <span>{symptomDetails?.unit}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Present Illness */}
        <div className="flex flex-col gap-2">
          <h3 className="mb-1 font-semibold">Present illness</h3>
          <p className="text-sm text-gray-500">
            Other symptoms that you are experiencing.
          </p>

          <Popover open={false} onOpenChange={() => {}}>
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
                <CommandInput placeholder="Search symptom..." className="h-9" />
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
                          setValue(currentValue === value ? "" : currentValue);
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

          <div className="flex gap-4 items-center">
            <div className="flex gap-2 h-10 p-2 items-center rounded-md bg-green-200 shadow-sm">
              <p>Fatigue: 2 days</p>
              <Button className="bg-transparent px-1 hover:bg-neutral-200 shadow-none">
                <FaRegTrashCan color="red" />
              </Button>
            </div>
            <div className="flex gap-2 h-10 p-2 items-center rounded-md bg-blue-200 shadow-sm">
              <p>Chills: 10 hours</p>
              <Button className="bg-transparent px-1 hover:bg-neutral-200 shadow-none">
                <FaRegTrashCan color="red" />
              </Button>
            </div>
            <div className="flex gap-2 h-10 p-2 items-center rounded-md bg-teal-200 shadow-sm">
              <p>Vomiting: 5 hours</p>
              <Button className="bg-transparent px-1 hover:bg-neutral-200 shadow-none">
                <FaRegTrashCan color="red" />
              </Button>
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
                disabled={value !== "other"}
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
            <Button type="submit" onClick={() => setDialogOpen(false)}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
