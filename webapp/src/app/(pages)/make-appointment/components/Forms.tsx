"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { FaCheck, FaChevronDown } from "react-icons/fa6";

export interface FormData {
  name: string;
  dateOfBirth: string;
  height: number;
  weight: number;
  email: string;
  phone: string;
  // patientId: string;

  department: string;
  date: string;
  time: string;
  status: string | null;

  symptoms: string[];
  inquiries: string[];
  predicted: boolean;
  prediction: string;

  notes: string;
  // bookingDetails: { confirmed: boolean } | null;
}

interface StepProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  direction?: "next" | "back";
  handleNext?: () => void;
  handleBack?: () => void;
}

export function Step1({ formData, setFormData }: StepProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Patient Information</h2>
      <div className="flex border-t-2 border-gray-400 rounded" />
      <div className="flex flex-col gap-4">
        <div>
          <p className="mb-1 font-semibold">Name</p>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <p className="mb-1 font-semibold">Date of birth</p>
          <Input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) =>
              setFormData({ ...formData, dateOfBirth: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <p className="mb-1 font-semibold">Height (cm)</p>
          <Input
            type="number"
            value={formData.height}
            onChange={(e) =>
              setFormData({ ...formData, height: parseInt(e.target.value) })
            }
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <p className="mb-1 font-semibold">Weight (kg)</p>
          <Input
            type="number"
            value={formData.weight}
            onChange={(e) =>
              setFormData({ ...formData, weight: parseInt(e.target.value) })
            }
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <p className="mb-1 font-semibold">Email</p>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <p className="mb-1 font-semibold">Phone number</p>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
          />
        </div>
      </div>
    </div>
  );
}

export function Step2({ formData, setFormData }: StepProps) {
  const [query, setQuery] = useState("");
  const [customSymptom, setCustomSymptom] = useState("");
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  // value/label format is advised
  // const allSymptoms = [
  //   "Headache",
  //   "Fever",
  //   "Cough",
  //   "Sore Throat",
  //   "Fatigue",
  //   "Shortness of Breath",
  //   "Chest Pain",
  //   "Nausea",
  //   "Vomiting",
  //   "Diarrhea",
  // ];

  const allSymptoms = [
    { value: "Headache", label: "Headache" },
    { value: "Fever", label: "Fever" },
    { value: "Cough", label: "Cough" },
    { value: "Sore Throat", label: "Sore Throat" },
    { value: "Fatigue", label: "Fatigue" },
    { value: "Shortness of Breath", label: "Shortness of Breath" },
    { value: "Chest Pain", label: "Chest Pain" },
    { value: "Nausea", label: "Nausea" },
    { value: "Vomiting", label: "Vomiting" },
    { value: "Diarrhea", label: "Diarrhea" },
  ];

  const commonSymptoms = ["Headache", "Fever", "Cough", "Sore Throat"];

  // const filteredSymptoms =
  //   query === ""
  //     ? allSymptoms
  //     : allSymptoms.filter((symptom) =>
  //         symptom.toLowerCase().includes(query.toLowerCase())
  //       );

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

  const handleCustomSymptomAdd = () => {
    if (customSymptom && !formData.symptoms.includes(customSymptom)) {
      setFormData({
        ...formData,
        symptoms: [...formData.symptoms, customSymptom],
      });
      setCustomSymptom("");
    }
  };

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
              ? allSymptoms.find((symptom) => symptom.value === value)?.label
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
                {allSymptoms.map((symptom) => (
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
      <div className="mt-4">
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
      </div>
    </div>
  );
}

export function Step3({
  formData,
  setFormData,
  handleNext,
  handleBack,
  direction,
}: StepProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(
    formData.inquiries[currentQuestion] || null
  );
  const [warning, setWarning] = useState(false);
  const predicted = formData.predicted;

  // dummy
  const totalQuestion = 5;
  const questions = [
    "Have you recently experienced any unintended weight loss?",
    "Have you recently experienced pain while walking?",
    "Have you had frequent continuous sneezing?",
    "Have you had any fever recently?",
    "Have you experienced shortness of breath?",
  ];

  useEffect(() => {
    if (direction === "next") {
      setCurrentQuestion(0);
      setSelectedAnswer(formData.inquiries[0] || null);
    } else if (direction === "back") {
      setCurrentQuestion(questions.length - 1);
      setSelectedAnswer(formData.inquiries[questions.length - 1] || null);
    }
  }, [direction]);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setWarning(false);
    const updatedInquiries = [...formData.inquiries];
    updatedInquiries[currentQuestion] = answer;
    setFormData({ ...formData, inquiries: updatedInquiries });
  };

  const handleNextQuestion = () => {
    if (selectedAnswer) {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(formData.inquiries[currentQuestion + 1] || null);
      } else {
        handleNext && handleNext();
      }
    } else {
      setWarning(true);
    }
  };

  const handleBackQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(formData.inquiries[currentQuestion - 1] || null);
    } else {
      handleBack && handleBack();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Symptom Inquiry</h2>
      <div className="flex border-t-2 border-gray-400 rounded" />

      <Progress value={((currentQuestion + 1) / totalQuestion) * 100} />

      <div className={cn(predicted ? "text-gray-500" : "text-black")}>
        {questions[currentQuestion]}
      </div>

      <RadioGroup
        value={formData.inquiries[currentQuestion] || ""}
        onValueChange={handleAnswer}
        className={cn(predicted ? "text-gray-500" : "text-black")}
        disabled={predicted}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="yes" id="option-yes" />
          <Label htmlFor="option-yes">Yes</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="no" id="option-no" />
          <Label htmlFor="option-no">No</Label>
        </div>
      </RadioGroup>

      {warning && (
        <p className="text-red-500 text-sm">Please select an answer.</p>
      )}

      {predicted && (
        <p className="text-sm">Prediction has started, changes not allowed.</p>
      )}

      <div className="flex justify-end gap-4 mt-6">
        <Button
          onClick={handleBackQuestion}
          variant={"secondary"}
          className="px-4 py-2 bg-gray-300 text-base"
        >
          Back
        </Button>
        <Button onClick={handleNextQuestion} className="px-4 py-2 text-base">
          Next
        </Button>
      </div>
    </div>
  );
}

export function Step4({ formData, setFormData }: StepProps) {
  const [showFullResults, setShowFullResults] = useState(false);

  const predictionResults = [
    { department: "Cardiology", percentage: 80 },
    { department: "Neurology", percentage: 70 },
    { department: "Orthopedics", percentage: 60 },
    { department: "General Purpose", percentage: 50 },
  ];

  const topPrediction = predictionResults[0];

  const handleExpandResults = () => {
    setShowFullResults(!showFullResults);
  };

  const handleDepartmentChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFormData({ ...formData, department: event.target.value });
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, date: event.target.value });
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, time: event.target.value });
  };

  const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, notes: event.target.value });
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Result and Appointment Booking</h2>
      <div className="flex border-t-2 border-gray-400 rounded" />

      {/* Prediction Result Section */}
      <div className="bg-gray-100 p-4 rounded shadow">
        <h3 className="text-lg font-semibold">Prediction Result</h3>
        <p>
          Top Prediction: {topPrediction.department} ({topPrediction.percentage}
          %)
        </p>
        <Button onClick={handleExpandResults} className="mt-2">
          {showFullResults ? "Hide Full Results" : "Show Full Results"}
        </Button>
        {showFullResults && (
          <ul className="mt-2">
            {predictionResults.map((result, index) => (
              <li key={index}>
                {result.department}: {result.percentage}%
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Make Appointment Section */}
      <div className="bg-gray-100 p-4 rounded shadow mt-4">
        <h3 className="text-lg font-semibold">Make Appointment</h3>
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700">
            Department
          </label>
          <select
            value={formData.department}
            onChange={handleDepartmentChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            {predictionResults.map((result, index) => (
              <option key={index} value={result.department}>
                {result.department}
              </option>
            ))}
            <option value="General Purpose">General Purpose</option>
          </select>
        </div>
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={handleDateChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700">
            Time
          </label>
          <input
            type="time"
            value={formData.time}
            onChange={handleTimeChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700">
            Additional Notes
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
  );
}

export function Step5({ formData }: { formData: FormData }) {
  const appointmentInfo = {
    appointmentId: "1234567890",
    name: "Jonh Doe",
    department: "Cardiology",
    departmentDesc: "Floor xx, yy Building",
    date: "2022-01-01",
    time: "10:00",
    status: "confirmed",
    notes: "I have past medical records.",
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Booking Details</h2>
      <div className="flex border-t-2 border-gray-400 rounded" />
      {/* Summary Section */}
      <div className="flex flex-col gap-4 bg-gray-100 p-4 rounded shadow">
        <p className="flex p-4 justify-center bg-teal-300 border-2 border-black rounded-md text-2xl font-bold">
          {appointmentInfo.department}
        </p>
        <p>Name: {appointmentInfo.name}</p>
        <p>Date: {appointmentInfo.date}</p>
        <p>Time: {appointmentInfo.time}</p>
        <p>Notes: {appointmentInfo.notes}</p>
        <p>Status: {appointmentInfo.status}</p>
      </div>
    </div>
  );
}
