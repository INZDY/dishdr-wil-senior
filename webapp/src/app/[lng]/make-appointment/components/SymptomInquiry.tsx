import { useTranslation } from "@/app/i18n/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { StepProps } from "@/types/formTypes";
import React, { useEffect, useState } from "react";

interface SymptomInquiryProps extends StepProps {
  lng: string;
}

export default function SymptomInquiry({
  formData,
  setFormData,
  lng,
  handleNext,
  handleBack,
  direction,
}: SymptomInquiryProps) {
  const { t } = useTranslation(lng, "make-appointment");
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [questionsUpdated, setQuestionsUpdated] = useState(false);

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const [inquiryQuestions, setInquiryQuestions] = useState<
    { code: string; question: string; answer: boolean | null }[]
  >([]);

  const [warning, setWarning] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const fetchQuestions = async () => {
      // get only selected choice from symptom selectio nstep
      const filteredComplaints = [
        ...formData.inquiries
          .filter((illness) => !illness.isOther && illness.type !== "inquiry")
          .map((illness) => ({ key: illness.code, value: true })),
      ];

      const formattedData = Object.fromEntries(
        filteredComplaints.map((item) => [item.key, item.value])
      );

      try {
        const response = await fetch("/api/symptom-inquiry/submit-answer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_id: formData.sessionId,
            symptoms: formattedData,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to submit answers");
        }

        const data = await response.json();
        console.log(data.question);

        // stop loading only if a question is returned
        if ("question" in data) {
          const qData = data.question;
          setInquiryQuestions([
            ...inquiryQuestions,
            {
              code: qData.code,
              question: lng === "th" ? qData.th : qData.en,
              answer: null,
            },
          ]);
          setLoading(false);
        } else if ("department" in data) {
          // const responses = Object.keys(data.response)
          //   .filter((key) => key.startsWith("result"))
          //   .map((key) => data.response[key])
          //   .join(", ");
          const dData = data.department;
          setFormData({
            ...formData,
            prediction: lng === "th" ? dData.th : dData.en,
          });
          setQuestionsUpdated(true);
        } else {
          // default suggestion for UX
          setFormData({
            ...formData,
            prediction: "General Medicine",
          });
          setQuestionsUpdated(true);
        }
      } catch (error) {
        console.error("Error getting questions:", error);
      } finally {
      }
    };
    if (!formData.predicted) {
      fetchQuestions();
    }
  }, []);

  // TODO: should change and not use useEffect
  useEffect(() => {
    if (questionsUpdated) {
      setQuestionsUpdated(false);
      if (formData.prediction === "" && inquiryQuestions.length > 0) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(
          inquiryQuestions[currentQuestion + 1]?.answer ? "yes" : "no"
        );
      } else {
        handleNext && handleNext();
      }
    }
  }, [
    questionsUpdated,
    inquiryQuestions,
    formData.prediction,
    currentQuestion,
    handleNext,
  ]);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setWarning(false);

    const updatedQuestions = [...inquiryQuestions];
    updatedQuestions[currentQuestion].answer = answer === "yes" ? true : false;
    setInquiryQuestions([...updatedQuestions]);
    // console.log(inquiryQuestions);
  };

  const submitAnswers = async () => {
    setLoading(true);

    // merge symptom selection + inquiry symptoms, excluding others
    const filteredComplaints = [
      ...formData.inquiries
        .filter((illness) => !illness.isOther && illness.type !== "inquiry")
        .map((illness) => ({ key: illness.code, value: true })),
      ...inquiryQuestions.map((illness) => ({
        key: illness.code,
        value: illness.answer!,
      })),
    ];

    const formattedData = Object.fromEntries(
      filteredComplaints.map((item) => [item.key, item.value])
    );

    try {
      const response = await fetch("/api/symptom-inquiry/submit-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: formData.sessionId,
          symptoms: formattedData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit answers");
      }

      const data = await response.json();
      // console.log(data);

      if ("question" in data) {
        const qData = data.question;
        setInquiryQuestions([
          ...inquiryQuestions,
          {
            code: qData.code,
            question: lng === "th" ? qData.th : qData.en,
            answer: null,
          },
        ]);
        setQuestionsUpdated(true);
      } else if ("department" in data) {
        // const responses = Object.keys(data.response)
        //   .filter((key) => key.startsWith("result"))
        //   .map((key) => data.response[key])
        //   .join(", ");
        const dData = data.department;
        setFormData({
          ...formData,
          prediction: lng === "th" ? dData.th : dData.en,
        });
        setQuestionsUpdated(true);
      } else {
        // default suggestion for UX
        setFormData({ ...formData, prediction: "General Medicine" });
        setQuestionsUpdated(true);
      }
    } catch (error) {
      console.error("Error submitting answers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = async () => {
    if (selectedAnswer) {
      await submitAnswers();
    } else {
      setWarning(true);
    }
  };

  // UNDECIDED: disabled for now
  const handleBackQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(
        inquiryQuestions[currentQuestion - 1]?.answer ? "yes" : "no"
      );
    } else {
      handleBack && handleBack();
    }
  };

  if (loading) {
    return (
      <p className="flex justify-center font-lg text-bold text-white">
        Loading...
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">{t("symptom-inquiry")}</h2>
      <div className="flex border-t-2 border-gray-400 rounded" />

      <Progress value={(currentQuestion / inquiryQuestions.length) * 100} />

      {loading ? (
        <div className="skeleton-loader">{t("processing")}</div>
      ) : (
        <>
          <p
            className={cn(formData.predicted ? "text-gray-500" : "text-black")}
          >
            {/* <span>{t("q-begin")}</span> */}
            <span>{inquiryQuestions[currentQuestion].question}</span>
            {/* <span>{t("q-end")}</span> */}
          </p>

          <RadioGroup
            value={
              inquiryQuestions[currentQuestion].answer === null
                ? ""
                : inquiryQuestions[currentQuestion].answer === true
                ? "yes"
                : "no"
            }
            onValueChange={handleAnswer}
            className={cn(formData.predicted ? "text-gray-500" : "text-black")}
            disabled={formData.predicted}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="option-yes" />
              <Label htmlFor="option-yes">{t("yes")}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="option-no" />
              <Label htmlFor="option-no">{t("no")}</Label>
            </div>
          </RadioGroup>

          {warning && (
            <p className="text-red-500 text-sm">Please select an answer.</p>
          )}

          {formData.predicted && (
            <p className="text-sm">
              Prediction has started, changes not allowed.
            </p>
          )}
        </>
      )}

      <div className="flex justify-end gap-4 mt-6">
        {/* <Button
          onClick={handleBackQuestion}
          variant={"secondary"}
          className="px-4 py-2 bg-gray-300 text-base"
          disabled={loading}
        >
          Back
        </Button> */}
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
