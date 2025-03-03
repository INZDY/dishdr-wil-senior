import { useTranslation } from "@/app/i18n/client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { StepProps } from "@/types/formTypes";
import { valueToLabel } from "@/utils/utils";
import { Department } from "@prisma/client";
import { format, getHours, getMinutes } from "date-fns";
import { th } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

interface ResultBookingProps extends StepProps {
  lng: string;
}

export default function ResultBooking({
  formData,
  setFormData,
  lng,
}: ResultBookingProps) {
  const { t } = useTranslation(lng, "make-appointment");
  const careType = formData.careType;
  const [departmentList, setDepartmentList] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);

  const [showFullResults, setShowFullResults] = useState(false);
  const [unavailableDates, setUnavailableDates] = useState<
    { _count: number; dateOnly: string }[]
  >([]);

  const predictionResults = formData.prediction.split(",");
  const topPrediction = predictionResults[0];

  useEffect(() => {
    async function fetchDepartments() {
      const response = await fetch("/api/actions/department-list");

      if (!response.ok) {
        throw new Error("Failed to get department list from server");
      }

      const data: Department[] = await response.json();

      // need to transform label format
      const department = valueToLabel(data);
      setDepartmentList(department);
    }
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (formData.department === "") return;
    async function fetchAvailableDates() {
      const department = formData.department;
      const response = await fetch("/api/actions/unavailable-dates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ department }),
      });

      if (!response.ok) {
        throw new Error("Failed to get available dates from server");
      }

      const data = await response.json();

      setUnavailableDates(data);
    }
    fetchAvailableDates();
  }, [formData.department]);

  const handleExpandResults = () => {
    setShowFullResults(!showFullResults);
  };

  const handleDepartmentChange = (value: string) => {
    setFormData({ ...formData, department: value });
  };

  const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, notes: event.target.value });
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">{t("result-booking")}</h2>
      <div className="flex border-t-2 border-gray-400 rounded" />

      {/* Prediction Result Section */}
      {careType === "symptoms" && (
        <div className="bg-gray-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold">{t("prediction-result")}</h3>
          <p>
            {t("top-prediction")} {topPrediction}{" "}
            {/* ({topPrediction.percentage}%) */}
          </p>
          <Button onClick={handleExpandResults} className="mt-2">
            {showFullResults ? t("hide-full") : t("show-full")}
          </Button>
          {showFullResults && (
            <ul className="mt-2">
              {predictionResults.map((result, index) => (
                <li key={index}>
                  {index + 1}. {result}
                  {/* {result.department}: {result.percentage}% */}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Make Appointment Section */}
      <div className="flex flex-col gap-4 bg-gray-100 p-4 rounded shadow mt-4">
        <h3 className="text-lg font-semibold">{t("make-appointment")}</h3>
        <div className="flex flex-col gap-4 max-w-lg">
          {/* department selection: disabled */}
          {careType === "scheduled" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("department")} <span className="text-red-500">*</span>
              </label>
              <Select
                onValueChange={
                  (value) => handleDepartmentChange(value)
                  // setFormData({ ...formData, department: value })
                }
              >
                <SelectTrigger className="bg-white mt-1">
                  <SelectValue placeholder={t("choose")} />
                </SelectTrigger>
                <SelectContent>
                  {departmentList.map((dept, index) => (
                    <SelectItem key={index} value={dept.value}>
                      {dept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {/* date picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("date")} <span className="text-red-500">*</span>
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  disabled={
                    careType === "scheduled" && !!!formData.department.length
                  }
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !formData.dateTime && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dateTime ? (
                    format(formData.dateTime, "PPP", { locale: th })
                  ) : (
                    <span>{t("pick-date")}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.dateTime}
                  onSelect={(date) => {
                    setFormData({ ...formData, dateTime: date });
                  }}
                  disabled={[
                    (date) => {
                      return (
                        date < new Date() ||
                        unavailableDates.some((obj) => {
                          const unavailableDate = new Date(obj.dateOnly);
                          unavailableDate.setHours(0, 0, 0, 0);
                          return (
                            date.toISOString() === unavailableDate.toISOString()
                          );
                        })
                      );
                    },
                    { dayOfWeek: [0] },
                  ]}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("time")} <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              disabled={
                careType === "scheduled" && !!!formData.department.length
              }
              value={`${getHours(formData.dateTime!)
                .toString()
                .padStart(2, "0")}:${getMinutes(formData.dateTime!)
                .toString()
                .padStart(2, "0")}`}
              onChange={(e) => {
                const value = e.target.value;
                const [hour, minute] = value.split(":").map(Number);
                const dateObj = new Date(formData.dateTime!);
                dateObj.setHours(hour, minute, 0, 0);

                setFormData({ ...formData, dateTime: dateObj });
              }}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700">
              {t("notes")}
            </label>
            <textarea
              value={formData.notes}
              onChange={handleNotesChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              rows={3}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}
