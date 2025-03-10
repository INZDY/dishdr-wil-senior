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
import { format } from "date-fns";
import React, { SetStateAction } from "react";

interface ActivityDialogProps {
  lng: string;
  currentUser: User | undefined;
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  appointmentList: Activity[];
  // setAppointmentList: React.Dispatch<React.SetStateAction<Activity[]>>;
  selectedAppointment: number;
  // setSelectedAppointment: React.Dispatch<React.SetStateAction<number>>;
  department: string;
  setDepartment: React.Dispatch<React.SetStateAction<string>>;
  status: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  handleEdit: (
    appointmentId: string,
    oriDept: string,
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
  selectedAppointment,
  // setSelectedAppointment,
  department,
  setDepartment,
  status,
  setStatus,
  handleEdit,
}: ActivityDialogProps) {
  const { t } = useTranslation(lng, "activity");

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
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
            <p>
              <span className="font-semibold mr-2">{t("app-date")}:</span>
              {format(
                new Date(appointmentList[selectedAppointment]?.dateTime),
                "dd/MM/yyyy HH:mm"
              )}
            </p>
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
                    {!!appointmentList[selectedAppointment].department
                      .length && (
                      <SelectItem
                        value={appointmentList[selectedAppointment].department}
                      >
                        {appointmentList[selectedAppointment].department}
                      </SelectItem>
                    )}
                    <SelectItem value="-">-</SelectItem>
                    <SelectItem value="general medicine">
                      General Medicine
                    </SelectItem>
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
