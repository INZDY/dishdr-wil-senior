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

export default function SymptomSelection({ formData, setFormData }: StepProps) {
  const [query, setQuery] = useState("");
  // const [customSymptom, setCustomSymptom] = useState("");
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [symptomList, setSymptomList] = useState<
    { value: string; label: string }[]
  >([]);

  const commonSymptoms = ["Headache", "Fever", "Cough", "Sore Throat"];

  useEffect(() => {
    async function fetchSymptoms() {
      const response = await fetch("/api/actions/symptom-list");

      if (!response.ok) {
        throw new Error("Failed to get symptom list from server");
      }

      const data: symptomList = await response.json();

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
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Preliminary Symptoms</h2>
      <div className="flex border-t-2 border-gray-400 rounded" />

      {/* Multi-select symptom selection list with dropdown menu */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value
              ? symptomList.find((symptom) => symptom.value === value)?.label
              : "Select symptoms..."}
            <FaChevronDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search framework..." className="h-9" />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {symptomList.map((symptom) => (
                  <CommandItem
                    key={symptom.value}
                    value={symptom.value}
                    onSelect={(currentValue: string) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {symptom.label}
                    <FaCheck
                      className={cn(
                        "ml-auto",
                        value === symptom.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Display selected symptoms as tags */}
      <div className="flex flex-wrap gap-2 mt-2">
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
      </div>

      {/* Common symptoms selection */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Common Symptoms</h3>
        <div className="flex flex-wrap gap-4 mt-2">
          {commonSymptoms.map((symptom, index) => (
            <Button
              key={index}
              onClick={() => handleSymptomSelect(symptom)}
              className="text-black bg-gray-200 p-2 rounded-md"
            >
              {symptom}
            </Button>
          ))}
        </div>
      </div>

      {/* Custom symptom input */}
      {/* <div className="mt-4">
        <h3 className="text-lg font-semibold">Add Custom Symptom</h3>
        <input
          type="text"
          value={customSymptom}
          onChange={(e) => setCustomSymptom(e.target.value)}
          placeholder="Enter custom symptom..."
          className="w-full p-2 border border-gray-300 rounded-md mt-2"
        />
        <Button onClick={handleCustomSymptomAdd} className="mt-2">
          Add Symptom
        </Button>
      </div> */}
    </div>
  );
}
