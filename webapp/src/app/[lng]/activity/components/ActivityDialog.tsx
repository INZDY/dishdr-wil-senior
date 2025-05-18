import { useTranslation } from "@/app/i18n/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Activity } from "@/types/dataTypes";
import { User } from "@prisma/client";
import { format, parse } from "date-fns";
import React from "react";

interface ActivityDialogProps {
  lng: string;
  currentUser: User | undefined;
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  departmentList: { value: string; label: string; labelTh: string }[];
  selectedAppointment: Activity;
  setSelectedAppointment: React.Dispatch<
    React.SetStateAction<Activity | undefined>
  >;
  handleEdit: (selectedAppointment: Activity, original: Activity) => void;
}

export default function ActivityDialog({
  lng,
  currentUser,
  dialogOpen,
  setDialogOpen,
  departmentList,
  selectedAppointment,
  setSelectedAppointment,
  handleEdit,
}: ActivityDialogProps) {
  const { t } = useTranslation(lng, "activity");
  const original = selectedAppointment;

  const symptomTypeExist = (type: string) => {
    return selectedAppointment.symptoms.some((s) => s.type === type);
  };

  const staffRolePredictionCheck = () => {
    return (
      currentUser?.role === "staff" && !!selectedAppointment.prediction?.length
    );
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent
        className="m-2 sm:max-w-[425px] max-h-[85vh] overflow-y-scroll"
        autoFocus={false}
      >
        <DialogHeader>
          <DialogTitle>{t("dialog-title")}</DialogTitle>
        </DialogHeader>

        {selectedAppointment !== undefined && (
          <div className="grid grid-cols-5 gap-4 py-2">
            <p className="col-span-2 font-semibold">{t("name")}:</p>
            <p className="col-span-3">{selectedAppointment.name}</p>
            <p className="col-span-2 font-semibold">{t("hn")}:</p>
            <p className="col-span-3">
              {!!selectedAppointment.hn?.length ? selectedAppointment.hn : "-"}
            </p>
            <p className="col-span-2 font-semibold">{t("phone")}:</p>
            <p className="col-span-3">{selectedAppointment.phone}</p>
            <p className="col-span-2 font-semibold">{t("chief")}:</p>
            <p className="col-span-3 flex">
              {symptomTypeExist("chief")
                ? selectedAppointment.symptoms.map((s, index) => {
                    if (s.type === "chief") {
                      return (
                        <span key={index}>
                          {lng === "th" ? s.symptomTh : s.symptom}, {s.duration}{" "}
                          {t(`${s.unit}`)}
                        </span>
                      );
                    }
                  })
                : "-"}
            </p>
            <p className="col-span-2 font-semibold">{t("illness")}:</p>
            <div className="col-span-3 flex">
              <div className="flex flex-col gap-1">
                {symptomTypeExist("present")
                  ? selectedAppointment.symptoms.map((s, index) => {
                      if (s.type === "present") {
                        return (
                          <p key={index}>
                            {lng === "th" ? s.symptomTh : s.symptom},{" "}
                            {s.duration} {t(`${s.unit}`)}
                          </p>
                        );
                      }
                    })
                  : "-"}
              </div>
            </div>
            <p className="col-span-2 font-semibold">{t("notes")}:</p>
            <p className="col-span-3">
              {!!selectedAppointment.notes?.length
                ? selectedAppointment.notes
                : "-"}
            </p>
            <p className="col-span-2 font-semibold">{t("app-date")}:</p>
            <div className="col-span-3">
              {currentUser?.role === "patient" ? (
                <span>
                  {format(
                    new Date(selectedAppointment.dateTime),
                    "dd/MM/yyyy HH:mm"
                  )}
                </span>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="date"
                    className="p-1 rounded-md"
                    defaultValue={format(
                      new Date(selectedAppointment.dateTime),
                      "yyyy-MM-dd"
                    )}
                    onChange={(e) => {
                      const date = parse(
                        e.target.value,
                        "yyyy-MM-dd",
                        new Date()
                      );
                      const [hour, minute] = format(
                        new Date(selectedAppointment.dateTime),
                        "HH:mm"
                      )
                        .split(":")
                        .map(Number);

                      date.setHours(hour, minute, 0, 0);
                      setSelectedAppointment({
                        ...selectedAppointment,
                        dateTime: date,
                      });
                    }}
                  />
                  <input
                    type="time"
                    className="p-1 rounded-md"
                    defaultValue={format(
                      new Date(selectedAppointment.dateTime),
                      "HH:mm"
                    )}
                    onChange={(e) => {
                      const [hour, minute] = e.target.value
                        .split(":")
                        .map(Number);
                      const dateObj = selectedAppointment.dateTime;
                      dateObj?.setHours(hour, minute, 0, 0);
                      console.log(dateObj);
                      setSelectedAppointment({
                        ...selectedAppointment,
                        dateTime: dateObj,
                      });
                    }}
                  />
                </div>
              )}
            </div>
            <p className="col-span-2 font-semibold">{t("dept")}:</p>
            <p className="col-span-3">
              {currentUser?.role === "patient" ? (
                <span>
                  {!!selectedAppointment.department.length
                    ? lng === "th"
                      ? selectedAppointment.departmentTh
                      : selectedAppointment.department
                    : `${t("wait-for-confirm")}`}
                </span>
              ) : (
                <Select
                  defaultValue={selectedAppointment.department}
                  onValueChange={(value) => {
                    // find th of the selected dept
                    const thDept = departmentList.find(
                      (dept) => dept.value === value
                    )?.labelTh;
                    // to pass undefined check
                    if (thDept) {
                      setSelectedAppointment({
                        ...selectedAppointment,
                        department: value,
                        departmentTh: thDept,
                      });
                    }
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentList.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {lng === "th" ? dept.labelTh : dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </p>
            <p className="col-span-2 font-semibold">{t("status")}:</p>
            <p className="col-span-3">
              {currentUser?.role === "patient" ? (
                <span>{t(`${selectedAppointment.status}`)}</span>
              ) : (
                <Select
                  value={
                    selectedAppointment.status.length
                      ? selectedAppointment.status
                      : ""
                  }
                  onValueChange={(value) =>
                    setSelectedAppointment({
                      ...selectedAppointment,
                      status: value,
                    })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">{t("pending")}</SelectItem>
                    <SelectItem value="approved">{t("approved")}</SelectItem>
                    <SelectItem value="canceled">{t("canceled")}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </p>

            <Separator className="col-span-5" />
            {/* New section for inquiry symptoms */}
            {staffRolePredictionCheck() && (
              <div className="col-span-5 flex flex-col mt-2 gap-4">
                <h3 className="font-semibold text-lg">
                  {t("inquiry-details")}
                </h3>
                <div className="flex flex-col gap-2">
                  {selectedAppointment.symptoms.map((s, index) => {
                    if (s.type === "inquiry") {
                      return (
                        <div
                          key={index}
                          className="p-2 grid grid-cols-5 border rounded-md bg-gray-50"
                        >
                          <p className="col-span-1 font-semibold">
                            {t("question")}:
                          </p>
                          <p className="col-span-4">
                            {lng === "th" ? s.symptomTh : s.symptom}
                          </p>
                          <p className="col-span-1 font-semibold">
                            {t("answer")}:
                          </p>
                          <p className="col-span-4">
                            {s.hasSymptom ? t("yes") : t("no")}
                          </p>
                        </div>
                      );
                    }
                  })}
                </div>
                <div className="flex">
                  <span className="mr-2 font-semibold text-base">
                    {t("predicted-dept")}:
                  </span>
                  <p>
                    {lng === "th"
                      ? selectedAppointment.predictionTh
                      : selectedAppointment.prediction}
                  </p>
                </div>
                <Separator className="col-span-5" />
              </div>
            )}
          </div>
        )}
        <DialogFooter>
          <div className="flex gap-6 justify-end">
            {currentUser?.role === "staff" && (
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {
                  handleEdit(selectedAppointment, original);
                  setDialogOpen(false);
                }}
              >
                {t("save")}
              </Button>
            )}
            <Button
              type="submit"
              onClick={() => {
                setDialogOpen(false);
              }}
            >
              {t("close")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
