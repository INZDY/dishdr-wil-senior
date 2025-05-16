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
import type { Activity, DepartmentFull } from "@/types/dataTypes";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";
import toast from "react-hot-toast";
import { useTranslation } from "@/app/i18n/client";
import ActivityDialog from "./components/ActivityDialog";
import { valueToLabel } from "@/utils/utils";
import { format } from "date-fns";
import { th } from "date-fns/locale";

export default function Activity({ params }: { params: any }) {
  const { lng } = React.use<{ lng: string }>(params);
  const { t } = useTranslation(lng, "activity");
  const router = useRouter();
  const session = useSession();

  const [appointmentList, setAppointmentList] = useState<Activity[]>([]);
  const [currentUser, setCurrentUser] = useState<User>();
  const [departmentList, setDepartmentList] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOption, setSortOption] = useState("by-book-desc");

  const [selectedAppointment, setSelectedAppointment] = useState<Activity>();
  const [dialogOpen, setDialogOpen] = useState(false);

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
        const appointmentData: Activity[] = await appointmentRes.json();
        setAppointmentList(appointmentData);
        console.log(appointmentData, "appointemntData");

        // departmentList
        // free for staff to choose, unconditioned with schedule constraints
        const deptRes = await fetch("/api/actions/department-list");
        if (!deptRes.ok) {
          throw new Error("Failed to fetch departments");
        }
        const deptData: DepartmentFull[] = (await deptRes.json()).departments;
        setDepartmentList(valueToLabel(deptData));
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

  const filteredAppointments = appointmentList
    .filter(
      (appointment) =>
        appointment.appointmentName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) &&
        (filterStatus === "all" || appointment.status === filterStatus)
    )
    .sort((a, b) => {
      if (sortOption === "by-app-asc") {
        return new Date(a.dateTime) > new Date(b.dateTime) ? 1 : -1;
      } else if (sortOption === "by-app-desc") {
        return new Date(a.dateTime) <= new Date(b.dateTime) ? 1 : -1;
      } else if (sortOption === "by-book-asc") {
        return new Date(a.createdAt) > new Date(b.createdAt) ? 1 : -1;
      } else if (sortOption === "by-book-desc") {
        return new Date(a.createdAt) <= new Date(b.createdAt) ? 1 : -1;
      }
      return 0;
    });

  const handleViewClick = (id: string) => {
    const realIndex = appointmentList.findIndex(
      (appointment) => appointment.id === id
    );
    setSelectedAppointment(appointmentList[realIndex]);
    setDialogOpen(true);
  };

  const handleEdit = async (
    selectedAppointment: Activity,
    original: Activity
  ) => {
    try {
      if (
        selectedAppointment?.dateTime === undefined ||
        !selectedAppointment?.department.length ||
        !selectedAppointment?.status.length
      ) {
        return;
      }

      const dateObj = new Date(selectedAppointment.dateTime!);
      const appointmentDateTime = format(dateObj, "dd/MM/yyyy HH:mm");
      const appointmentName = `${selectedAppointment.name} | ${appointmentDateTime}`;

      const formattedData = {
        appointmentId: selectedAppointment.id,
        appointmentName: appointmentName,
        department: selectedAppointment.department,
        dateTime: selectedAppointment.dateTime,
        status: selectedAppointment.status,
      };
      console.log(formattedData);

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
      <div className="flex flex-col max-w-screen-lg max-h-[85vh] overflow-y-scroll mx-auto my-12 p-4 gap-4 bg-white shadow rounded">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">{t("activity")}</h1>
          {currentUser?.role === "patient" && (
            <Button onClick={() => router.push(`/${lng}/make-appointment`)}>
              <span>+</span>
              {t("new-appointment")}
            </Button>
          )}
        </div>

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
                {t("status-filter")}: {t(`${filterStatus}`)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all")}</SelectItem>
              <SelectItem value="approved">{t("approved")}</SelectItem>
              <SelectItem value="pending">{t("pending")}</SelectItem>
              <SelectItem value="canceled">{t("canceled")}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by...">
                {t("sort")}: {t(`${sortOption}`)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="by-book-desc">{t("by-book-desc")}</SelectItem>
              <SelectItem value="by-book-asc">{t("by-book-asc")}</SelectItem>
              <SelectItem value="by-app-desc">{t("by-app-desc")}</SelectItem>
              <SelectItem value="by-app-asc">{t("by-app-asc")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* appointments */}
        {!!!appointmentList.length ? (
          <p className="py-8 text-center">{t("no-record")}</p>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment, index) => (
              <div
                key={appointment.id}
                className="flex px-4 py-2 gap-2 border rounded justify-between items-center bg-neutral-100"
              >
                <div className="flex flex-col gap-1">
                  <div className="font-bold">{appointment.appointmentName}</div>
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold mr-1">{t("dept")}:</span>
                    {!!appointment.department.length
                      ? appointment.department
                      : `${t("wait-for-confirm")}`}
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      appointment.status === "approved"
                        ? "text-green-500"
                        : appointment.status === "pending"
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {t(`${appointment.status}`)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="bg-white text-black hover:bg-neutral-300"
                    onClick={() => handleViewClick(appointment.id)}
                  >
                    {currentUser?.role === "patient" ? t("view") : t("edit")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ActivityDialog
        lng={lng}
        currentUser={currentUser}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        selectedAppointment={selectedAppointment as Activity}
        setSelectedAppointment={setSelectedAppointment}
        departmentList={departmentList}
        handleEdit={handleEdit}
      />
    </>
  );
}
