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
  departmentList: { value: string; label: string }[];
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

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent
        className="m-2 sm:max-w-[425px] max-h-lvh overflow-y-scroll"
        autoFocus={false}
      >
        <DialogHeader>
          <DialogTitle>{t("dialog-title")}</DialogTitle>
        </DialogHeader>

        {selectedAppointment !== undefined && (
          <div className="grid gap-4 py-2">
            <p>
              <span className="font-semibold mr-2">{t("name")}:</span>
              {selectedAppointment.name}
            </p>
            <p>
              <span className="font-semibold mr-2">{t("hn")}:</span>
              {selectedAppointment.hn}
            </p>
            <p>
              <span className="font-semibold mr-2">{t("phone")}:</span>
              {selectedAppointment.phone}
            </p>
            <p className="flex">
              <span className="font-semibold mr-2">{t("chief")}:</span>
              {selectedAppointment.symptoms.map((s, index) => {
                if (s.type === "chief") {
                  return (
                    <span key={index}>
                      {s.symptom}, {s.duration} {t(`${s.unit}`)}
                    </span>
                  );
                }
              })}
            </p>
            <div className="flex">
              <span className="font-semibold mr-2">{t("illness")}:</span>
              <div className="flex flex-col gap-1">
                {selectedAppointment.symptoms.map((s, index) => {
                  if (s.type === "present") {
                    return (
                      <p key={index}>
                        {s.symptom}, {s.duration} {t(`${s.unit}`)}
                      </p>
                    );
                  }
                })}
              </div>
            </div>
            <div>
              <span className="font-semibold mr-2">{t("app-date")}:</span>
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
                    className="px-2 py-1 rounded-md"
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
                    className="px-2 py-1 rounded-md"
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
            <p>
              <span className="font-semibold mr-2">{t("dept")}:</span>
              {currentUser?.role === "patient" ? (
                <span>{selectedAppointment.department}</span>
              ) : (
                <Select
                  value={
                    selectedAppointment.department.length
                      ? selectedAppointment.department
                      : ""
                  }
                  onValueChange={(value) =>
                    setSelectedAppointment({
                      ...selectedAppointment,
                      department: value,
                    })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentList.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </p>
            <p>
              <span className="font-semibold mr-2">{t("status")}:</span>
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

            <Separator />
            {/* New section for inquiry symptoms */}
            {currentUser?.role === "staff" && (
              <div className="mt-2">
                <h3 className="font-semibold text-lg mb-2">
                  {t("inquiry-details")}
                </h3>
                <div className="flex flex-col gap-2">
                  {selectedAppointment.symptoms.map((s, index) => {
                    if (s.type === "inquiry") {
                      return (
                        <div
                          key={index}
                          className="p-2 border rounded-md bg-gray-50"
                        >
                          <p>
                            <span className="font-semibold mr-2">
                              {t("question")}:
                            </span>
                            {s.symptom}
                          </p>
                          <p>
                            <span className="font-semibold mr-2">
                              {t("answer")}:
                            </span>
                            {s.hasSymptom ? t("yes") : t("no")}
                          </p>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            )}
          </div>
        )}
        <DialogFooter>
          <div className="flex gap-2 justify-end">
            {currentUser?.role === "staff" && (
              <Button
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
