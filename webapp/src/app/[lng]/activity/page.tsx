"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Activity } from "@/types/dataTypes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { User } from "@prisma/client";
import toast from "react-hot-toast";
import { useTranslation } from "@/app/i18n/client";

export default function Activity({ params }: { params: any }) {
  const { lng } = React.use<{ lng: string }>(params);
  const { t } = useTranslation(lng, "activity");
  const router = useRouter();
  const session = useSession();

  const [appointmentList, setAppointmentList] = useState<Activity[]>([]);
  const [currentUser, setCurrentUser] = useState<User>();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOption, setSortOption] = useState("date");

  const [selectedAppointment, setSelectedAppointment] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // user
        const userRes = await fetch("/api/actions/user");
        if (!userRes.ok) {
          throw new Error("Failed to fetch activities");
        }
        const userData: User = await userRes.json();
        setCurrentUser(userData);

        // appointments
        const appointmentRes = await fetch("/api/actions/activity-list");
        if (!appointmentRes.ok) {
          throw new Error("Failed to fetch activities");
        }
        const appoitmentData: Activity[] = await appointmentRes.json();
        setAppointmentList(appoitmentData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    }

    if (session.status === "unauthenticated") {
      router.push("/");
    } else if (session.status === "authenticated") {
      fetchData();
    }
  }, [session]);

  // create profile
  useEffect(() => {
    async function createProfile() {
      try {
        const response = await fetch("/api/profile-creation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(session.data?.user),
        });

        if (!response.ok) {
          throw new Error("Failed to create profile");
        }
      } catch (error) {
        console.log("Error creating profile", error);
      }
    }
    if (session.data?.user) {
      createProfile();
    }
  }, [session]);

  // conflicts with Dialog
  const filteredAppointments = appointmentList.filter(
    (appointment) =>
      filterStatus === "all" ||
      (appointment.status === filterStatus &&
        appointment.appointmentName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
  );
  // already pre-sorted from db
  // .sort((a, b) => {
  //   if (sortOption === "date") {
  //     return new Date(a.dateTime) > new Date(b.dateTime) ? -1 : 1;
  //   }
  //   return 0;
  // });

  const handleViewClick = (id: string) => {
    const realIndex = appointmentList.findIndex(
      (appointment) => appointment.id === id
    );
    setSelectedAppointment(realIndex);
    setDialogOpen(true);
  };

  const handleEdit = async (
    appointmentId: string,
    oriDept: string,
    oriStatus: string
  ) => {
    console.log(department, status);
    try {
      if (!department.length && !status.length) {
        return;
      }

      const formattedData = {
        appointmentId,
        department: department.length ? department : oriDept,
        status: status.length ? status : oriStatus,
      };

      await fetch("/api/activity-management", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });
    } catch (error) {
      console.error("Error handling appointment edit");
    } finally {
      router.refresh();
      toast.success("Appointment edited successfully!");
    }
  };

  if (loading) {
    return (
      <p className="flex justify-center font-lg text-bold text-white">
        Loading...
      </p>
    );
  }

  if (!session) {
    router.push("/");
  }

  return (
    <>
      <div className="flex flex-col max-w-screen-lg max-h-svh overflow-y-scroll mx-auto my-12 p-4 gap-4 bg-white shadow rounded">
        <h1 className="text-2xl font-bold mb-4">{t("activity")}</h1>

        {/* toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <Input
            placeholder={t("search-appointments")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by...">
                {t("filter")}: {filterStatus}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by...">
                {t("sort")}: {sortOption}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
            </SelectContent>
          </Select>
          {currentUser?.role === "patient" && (
            <Button onClick={() => router.push(`/${lng}/make-appointment`)}>
              {t("new-appointment")}
            </Button>
          )}
        </div>

        {/* appointments */}
        {appointmentList.length === 0 ? (
          <p className="py-8 text-center">No appointment record</p>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment, index) => (
              <div
                key={appointment.id}
                className="p-4 border rounded flex justify-between items-center bg-neutral-100"
              >
                <div className="flex flex-col gap-2">
                  <div className="font-bold">{appointment.appointmentName}</div>
                  <div className="text-sm text-gray-500">
                    Department: {appointment.department}
                  </div>
                  <div
                    className={`text-sm ${
                      appointment.status === "completed"
                        ? "text-green-500"
                        : appointment.status === "pending"
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {appointment.status}
                  </div>
                </div>
                <div className="flex gap-2">
                  {currentUser?.role === "patient" && (
                    <>
                      <Button
                        className="bg-white text-black hover:bg-neutral-300"
                        // variant="secondary"
                        onClick={() => handleViewClick(appointment.id)}
                      >
                        {t("view")}
                      </Button>
                      {/* <Button variant="destructive">Cancel</Button> */}
                    </>
                  )}
                  {currentUser?.role === "staff" && (
                    <Button
                      className="bg-white text-black hover:bg-neutral-300"
                      // variant="secondary"
                      onClick={() => handleViewClick(appointment.id)}
                    >
                      {t("edit")}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
                <span className="font-semibold mr-2">{t("dob")}:</span>
                {format(
                  new Date(appointmentList[selectedAppointment]?.dob as Date),
                  "dd/MM/yyyy"
                )}
              </p>
              <p>
                <span className="font-semibold mr-2">{t("height")}:</span>
                {appointmentList[selectedAppointment]?.height}
              </p>
              <p>
                <span className="font-semibold mr-2">{t("weight")}:</span>
                {appointmentList[selectedAppointment]?.weight}
              </p>
              <p>
                <span className="font-semibold mr-2">{t("email")}:</span>
                {appointmentList[selectedAppointment]?.email}
              </p>
              <p>
                <span className="font-semibold mr-2">{t("phone")}:</span>
                {appointmentList[selectedAppointment]?.phone}
              </p>
              <p>
                <span className="font-semibold mr-2">
                  {t("chronic-disease")}:
                </span>
                {appointmentList[selectedAppointment]?.chronicDisease}
              </p>
              <p>
                <span className="font-semibold mr-2">{t("allergy")}:</span>
                {appointmentList[selectedAppointment]?.allergies}
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
                  <span>{appointmentList[selectedAppointment].status}</span>
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
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="canceled">canceled</SelectItem>
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
    </>
  );
}
