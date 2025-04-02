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
import { Activity } from "@/types/dataTypes";
import { User } from "@prisma/client";
import { format, parse } from "date-fns";
import React from "react";

interface ActivityDialogProps {
  lng: string;
  currentUser: User | undefined;
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  appointmentList: Activity[];
  // setAppointmentList: React.Dispatch<React.SetStateAction<Activity[]>>;
  departmentList: { value: string; label: string }[];
  setDepartmentList: React.Dispatch<
    React.SetStateAction<{ value: string; label: string }[]>
  >;
  selectedAppointment: number;
  // setSelectedAppointment: React.Dispatch<React.SetStateAction<number>>;
  department: string;
  setDepartment: React.Dispatch<React.SetStateAction<string>>;
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  status: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  handleEdit: (
    appointmentId: string,
    oriDept: string,
    oriDate: Date,
    oriStatus: string
  ) => void;
}

export default function ActivityDialog({
  lng,
  currentUser,
  dialogOpen,
  setDialogOpen,
  appointmentList,
  // setAppointmentList,
  departmentList,
  setDepartmentList,
  selectedAppointment,
  // setSelectedAppointment,
  department,
  setDepartment,
  date,
  setDate,
  status,
  setStatus,
  handleEdit,
}: ActivityDialogProps) {
  const { t } = useTranslation(lng, "activity");

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-[425px]" autoFocus={false}>
        <DialogHeader>
          <DialogTitle>{t("dialog-title")}</DialogTitle>
        </DialogHeader>

        {appointmentList.length && (
          <div className="grid gap-4 py-2">
            <p>
              <span className="font-semibold mr-2">{t("name")}:</span>
              {appointmentList[selectedAppointment]?.name}
            </p>
            <p>
              <span className="font-semibold mr-2">{t("hn")}:</span>
              {appointmentList[selectedAppointment]?.hn}
            </p>
            <p>
              <span className="font-semibold mr-2">{t("phone")}:</span>
              {appointmentList[selectedAppointment]?.phone}
            </p>
            <p className="flex">
              <span className="font-semibold mr-2">{t("chief")}:</span>
              {appointmentList[selectedAppointment]?.symptoms.map(
                (s, index) => {
                  if (s.type === "chief") {
                    return (
                      <span key={index}>
                        {s.symptom}, {s.duration} {s.unit}
                      </span>
                    );
                  }
                }
              )}
            </p>
            <div className="flex">
              <span className="font-semibold mr-2">{t("illness")}:</span>
              <div className="flex flex-col gap-1">
                {appointmentList[selectedAppointment]?.symptoms.map(
                  (s, index) => {
                    if (s.type === "present") {
                      return (
                        <p key={index}>
                          {s.symptom}, {s.duration} {s.unit}
                        </p>
                      );
                    }
                  }
                )}
              </div>
            </div>
            <div>
              <span className="font-semibold mr-2">{t("app-date")}:</span>
              {currentUser?.role === "patient" ? (
                <span>
                  {format(
                    new Date(appointmentList[selectedAppointment]?.dateTime),
                    "dd/MM/yyyy HH:mm"
                  )}
                </span>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="date"
                    className="px-2 py-1 rounded-md"
                    defaultValue={format(
                      new Date(appointmentList[selectedAppointment]?.dateTime),
                      "yyyy-MM-dd"
                    )}
                    onChange={(e) =>
                      setDate(parse(e.target.value, "yyyy-MM-dd", new Date()))
                    }
                  />
                  <input
                    type="time"
                    className="px-2 py-1 rounded-md"
                    defaultValue={format(
                      new Date(appointmentList[selectedAppointment]?.dateTime),
                      "HH:mm"
                    )}
                    onChange={(e) => {
                      const [hour, minute] = e.target.value
                        .split(":")
                        .map(Number);
                      const dateObj = date;
                      dateObj?.setHours(hour, minute, 0, 0);
                      console.log(dateObj);
                      setDate(dateObj);
                    }}
                  />
                </div>
              )}
            </div>
            <p>
              <span className="font-semibold mr-2">{t("dept")}:</span>
              {currentUser?.role === "patient" ? (
                <span>{appointmentList[selectedAppointment].department}</span>
              ) : (
                <Select
                  value={
                    department.length
                      ? department
                      : appointmentList[selectedAppointment].department
                  }
                  onValueChange={(value) => setDepartment(value)}
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
                <span>
                  {t(`${appointmentList[selectedAppointment].status}`)}
                </span>
              ) : (
                <Select
                  value={
                    status.length
                      ? status
                      : appointmentList[selectedAppointment].status
                  }
                  onValueChange={(value) => setStatus(value)}
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
          </div>
        )}
        <DialogFooter>
          <Button
            onClick={() => {
              handleEdit(
                appointmentList[selectedAppointment].id,
                appointmentList[selectedAppointment].department,
                appointmentList[selectedAppointment].dateTime,
                appointmentList[selectedAppointment].status
              );
              setDialogOpen(false);
            }}
          >
            {t("save")}
          </Button>
          <Button
            type="submit"
            onClick={() => {
              setDialogOpen(false);
            }}
          >
            {t("close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
