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
import { useCurrentSession } from "@/hooks/use-session";
import { format } from "date-fns";

export default function Activity() {
  const router = useRouter();
  const session = useCurrentSession();

  const [appointmentList, setAppointmentList] = useState<Activity[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOption, setSortOption] = useState("date");

  const [selectedAppointment, setSelectedAppointment] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      const response = await fetch("/api/actions/activity-list");

      if (!response.ok) {
        throw new Error("Failed to fetch activities");
      }

      const data: Activity[] = await response.json();
      console.log(data);
      setAppointmentList(data);
      setLoading(false);
    }
    if (session.status === "unauthenticated") {
      router.push("/");
    } else if (session.status === "authenticated") {
      fetchActivities();
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

  if (loading) {
    return (
      <p className="flex justify-center font-lg text-bold text-white">
        Loading...
      </p>
    );
  }

  return (
    <>
      <div className="flex flex-col max-w-screen-xl mx-auto my-12 p-4 gap-4 bg-white shadow rounded">
        <h1 className="text-2xl font-bold mb-4">Activity</h1>

        {/* toolbar */}
        <div className="flex gap-4 mb-4">
          <Input
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by...">
                Filter: {filterStatus}
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
                Sort: {sortOption}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => (window.location.href = "/make-appointment")}>
            Make Appointment
          </Button>
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
                  {appointment.status === "pending" && (
                    <>
                      <Button
                        variant="secondary"
                        onClick={() => handleViewClick(appointment.id)}
                      >
                        Edit
                      </Button>
                      <Button variant="destructive">Cancel</Button>
                    </>
                  )}
                  {appointment.status === "completed" && (
                    <Button
                      variant="secondary"
                      onClick={() => handleViewClick(appointment.id)}
                    >
                      View
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
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              Review the details of your appointment
            </DialogDescription>
          </DialogHeader>

          {appointmentList.length && (
            <div className="grid gap-4 py-2">
              <p>
                <span className="font-semibold mr-2">Name:</span>
                {appointmentList[selectedAppointment]?.patient.name}
              </p>
              <p>
                <span className="font-semibold mr-2">Date of Birth:</span>
                {/* {appointmentList[
                selectedAppointment
              ]?.patient.DOB!.toDateString()} */}
                {"DOB"}
              </p>
              <p>
                <span className="font-semibold mr-2">Height:</span>
                {appointmentList[selectedAppointment]?.patient.height}
              </p>
              <p>
                <span className="font-semibold mr-2">Weight:</span>
                {appointmentList[selectedAppointment]?.patient.weight}
              </p>
              <p>
                <span className="font-semibold mr-2">Chronic Disease:</span>
                {appointmentList[selectedAppointment]?.patient.chronicDisease}
              </p>
              <p>
                <span className="font-semibold mr-2">Allergies:</span>
                {appointmentList[selectedAppointment]?.patient.allergies}
              </p>
              <p className="flex">
                <span className="font-semibold mr-2">Chief Complaint:</span>
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
                <span className="font-semibold mr-2">Present Illness:</span>
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
                <span className="font-semibold mr-2">Appointment Date:</span>
                {format(
                  new Date(appointmentList[selectedAppointment]?.dateTime),
                  "MM/dd/yyyy HH:mm"
                )}
              </p>
              <p>
                <span className="font-semibold mr-2">Status:</span>
                {appointmentList[selectedAppointment]?.status}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              type="submit"
              onClick={() => {
                setDialogOpen(false);
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
