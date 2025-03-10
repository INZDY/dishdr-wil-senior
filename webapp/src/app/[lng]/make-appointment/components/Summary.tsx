import { useTranslation } from "@/app/i18n/client";
import { FormData, StepProps } from "@/types/formTypes";
import { format, getHours, getMinutes } from "date-fns";
import { th } from "date-fns/locale";
import React from "react";

interface SummaryProps {
  formData: FormData;
  lng: string;
}

export default function Summary({ formData, lng }: SummaryProps) {
  const { t } = useTranslation(lng, "make-appointment");
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">{t("booking-detail")}</h2>
      <div className="flex border-t-2 border-gray-400 rounded" />
      {/* Summary Section */}
      <div className="flex flex-col gap-2 bg-gray-100 p-4 rounded shadow">
        <p className=" py-2 border-b-2">
          <span className="font-semibold">{t("name")}: </span>
          <br />
          {formData.name}
        </p>
        <p className=" py-2 border-b-2">
          <span className="font-semibold">{t("department")}: </span>
          <br />
          {formData.department}
        </p>
        <p className=" py-2 border-b-2">
          <span className="font-semibold">{t("date")}:</span>
          <br />
          {format(formData.dateTime!, "dd/MM/yyyy", { locale: th })}
        </p>
        <p className=" py-2 border-b-2">
          <span className="font-semibold">{t("time")}:</span>
          <br />
          {`${getHours(formData.dateTime!)
            .toString()
            .padStart(2, "0")}:${getMinutes(formData.dateTime!)
            .toString()
            .padStart(2, "0")}`}
        </p>
        <p className=" py-2 border-b-2">
          <span className="font-semibold">{t("notes")}:</span>
          <br />
          {formData.notes}
        </p>
        <p>
          <span className="font-semibold">{t("status")}:</span>
          <br />
          {t(`${formData.status}`)}
        </p>
      </div>
    </div>
  );
}
