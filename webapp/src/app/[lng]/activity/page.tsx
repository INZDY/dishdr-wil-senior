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
import { Label } from "@/components/ui/label";

export default function Activity() {
  const [appointmentList, setAppointmentList] = useState<Activity[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOption, setSortOption] = useState("date");

  const [selectedAppointment, setSelectedAppointment] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchActivities() {
      const response = await fetch("/api/actions/activity-list");

      if (!response.ok) {
        throw new Error("Failed to fetch activities");
      }

      const data: Activity[] = await response.json();
      console.log(data);
      setAppointmentList(data);
    }
    fetchActivities();
  }, []);

  const filteredAppointments = appointmentList
    .filter(
      (appointment) =>
        filterStatus === "all" || appointment.status === filterStatus
      // &&
      // appointment.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "date") {
        return new Date(a.dateTime) > new Date(b.dateTime) ? 1 : -1;
      }
      return 0;
    });

  const handleViewClick = (index: number) => {
    console.log(appointmentList[index], selectedAppointment);
    setSelectedAppointment(index);
    setDialogOpen(true);
  };

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
                <div>
                  <div className="font-bold">Appointment {index + 1}</div>
                  <div className="text-sm text-gray-500">
                    {appointment.dateTime}
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
                        onClick={() => handleViewClick(index)}
                      >
                        Edit
                      </Button>
                      <Button variant="destructive">Cancel</Button>
                    </>
                  )}
                  {appointment.status === "completed" && (
                    <Button
                      variant="secondary"
                      onClick={() => handleViewClick(index)}
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
          <div className="grid gap-4 py-2">
            <p>
              <span className="font-semibold mr-2">Name:</span>
              {appointmentList[selectedAppointment]?.patient.name}
            </p>
            <p>
              <span className="font-semibold mr-2">Date of Birth:</span>
              {appointmentList[selectedAppointment]?.patient.dateOfBirth}
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
            <p>
              <span className="font-semibold mr-2">Chief Complaint:</span>
              {appointmentList[selectedAppointment]?.symptoms.map((s) => {
                if (s.type === "chief") {
                  return `${s.symptom}, ${s.duration} ${s.unit}`;
                }
              })}
            </p>
            <div className="flex">
              <span className="font-semibold mr-2">Present Illness:</span>
              <div className="flex flex-col gap-1">
                {appointmentList[selectedAppointment]?.symptoms.map((s) => {
                  if (s.type === "present") {
                    return (
                      <p>
                        {s.symptom}, {s.duration} {s.unit}
                      </p>
                    );
                  }
                })}
              </div>
            </div>
            <p>
              <span className="font-semibold mr-2">Appointment Date:</span>
              {appointmentList[selectedAppointment]?.dateTime}
            </p>
            <p>
              <span className="font-semibold mr-2">Status:</span>
              {appointmentList[selectedAppointment]?.status}
            </p>
          </div>
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
