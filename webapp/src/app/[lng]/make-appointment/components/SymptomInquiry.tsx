import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { StepProps } from "@/types/formTypes";
import React, { useEffect, useState } from "react";

export default function SymptomInquiry({
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
  const [loading, setLoading] = useState(false);
  const predicted = formData.predicted;

  // dummy
  // actual questions(+number of question) should be fetched from the server
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

  const submitAnswers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/symptom-inquiry/submit-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: formData.sessionId,
          inquiries: formData.inquiries,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit answers");
      }

      const data = await response.json();
      console.log(data);
      // add question/prediction to the form data
      // setFormData({
      //   ...formData,
      //   sessionId: data.sessionId,
      //   inquiries: data.inquiries,
      //   prediction: data.department,
      // });
    } catch (error) {
      console.error("Error submitting answers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = async () => {
    if (selectedAnswer) {
      await submitAnswers();
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

      {loading ? (
        <div className="skeleton-loader">Processing...</div>
      ) : (
        <>
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
            <p className="text-sm">
              Prediction has started, changes not allowed.
            </p>
          )}
        </>
      )}

      <div className="flex justify-end gap-4 mt-6">
        <Button
          onClick={handleBackQuestion}
          variant={"secondary"}
          className="px-4 py-2 bg-gray-300 text-base"
          disabled={loading}
        >
          Back
        </Button>
        <Button
          onClick={handleNextQuestion}
          className="px-4 py-2 text-base"
          disabled={loading}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
