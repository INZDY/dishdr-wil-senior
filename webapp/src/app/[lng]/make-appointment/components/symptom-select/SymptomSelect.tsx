import { useTranslation } from "@/app/i18n/client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FormData } from "@/types/formTypes";
import React from "react";
import { FaCheck, FaChevronDown, FaRegTrashCan } from "react-icons/fa6";

interface SymptomSelectProps {
  lng: string;
  chiefOpen: boolean;
  setChiefOpen: React.Dispatch<React.SetStateAction<boolean>>;
  chiefValue: string;
  setChiefValue: React.Dispatch<React.SetStateAction<string>>;
  presentOpen: boolean;
  setPresentOpen: React.Dispatch<React.SetStateAction<boolean>>;
  presentValue: string;
  setPresentValue: React.Dispatch<React.SetStateAction<string>>;
  symptomList: { value: string; label: string }[];
  // setSymptomList: React.Dispatch<
  //   React.SetStateAction<React.Dispatch<{ value: string; label: string }[]>>
  // >;
  handleDropdownSelect: (
    code: string,
    name: string,
    type: "chief" | "present"
  ) => void;
  handleDeletePresentIllness: (index: number) => void;
  formData: FormData;
}

export default function SymptomSelect({
  lng,
  chiefOpen,
  setChiefOpen,
  chiefValue,
  setChiefValue,
  presentOpen,
  setPresentOpen,
  presentValue,
  setPresentValue,
  symptomList,
  // setSymptomList,
  handleDropdownSelect,
  handleDeletePresentIllness,
  formData,
}: SymptomSelectProps) {
  const { t } = useTranslation(lng, "make-appointment");
  return (
    <div>
      {/* Chief complaint */}
      <div className="flex flex-col gap-2">
        <p className="text-sm">
          <span className="text-red-500">*{(t("experimental-feat"))} </span>
          {/* ตัวเลือกจะเป็นภาษาอังกฤษ กรอกภาษาไทยได้โดยใช้ตัวเลือก
          &quot;Other...&quot; */}
        </p>
        <h3 className="mb-1 font-semibold">{t("chief")}</h3>
        <p className="text-sm text-gray-500">{t("chief-desc")}</p>

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
                  : symptomList.find((symptom) => symptom.value === chiefValue)
                      ?.label
                : "Select symptoms..."}
              <FaChevronDown className="opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[200px] p-0">
            <Command
              // filter={(search, value) => {
              //   // Find the matching option by value
              //   const item = symptomList.find(
              //     (symptom) => symptom.value === value
              //   );
              //   return (
              //     item?.label.toLowerCase().includes(search.toLowerCase()) ??
              //     0
              //   );
              // }}
            >
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
                      handleDropdownSelect(currentValue, currentValue, "chief");
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
                        handleDropdownSelect(
                          currentValue,
                          symptom.label,
                          "chief"
                        );
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
        <h3 className="mb-1 font-semibold">{t("illness")}</h3>
        <p className="text-sm text-gray-500">{t("illness-desc")}</p>

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
                      handleDropdownSelect(
                        currentValue,
                        currentValue,
                        "present"
                      );
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
                        handleDropdownSelect(
                          currentValue,
                          symptom.label,
                          "present"
                        );
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
  );
}
