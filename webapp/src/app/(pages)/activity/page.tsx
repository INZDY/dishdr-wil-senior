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

export default function Activity() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOption, setSortOption] = useState("date");
  const [selectedAppointment, setSelectedAppointment] = useState<
    (typeof appointments)[0] | null
  >(null);

  const appointments = [
    // Dummy data
    {
      id: 1,
      date: "2025-10-01",
      status: "completed",
      description: "Appointment 1",
    },
    {
      id: 2,
      date: "2025-10-05",
      status: "pending",
      description: "Appointment 2",
    },
    {
      id: 3,
      date: "2025-10-10",
      status: "cancelled",
      description: "Appointment 3",
    },
  ];

  const filteredAppointments = appointments
    .filter(
      (appointment) =>
        (filterStatus === "all" || appointment.status === filterStatus) &&
        appointment.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "date") {
        return new Date(a.date) > new Date(b.date) ? 1 : -1;
      }
      return 0;
    });

  const handleViewClick = (appointment: (typeof appointments)[0]) => {
    console.log(appointment, selectedAppointment);
    if (selectedAppointment && appointment.id === selectedAppointment.id) {
      setSelectedAppointment(null);
    } else {
      setSelectedAppointment(appointment);
    }
  };

  
  

  return (
    <div className="flex flex-col max-w-screen-xl mx-auto my-12 p-4 gap-4 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Activity</h1>

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

      <div className="space-y-4">
        {filteredAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="p-4 border rounded flex justify-between items-center bg-neutral-100"
          >
            <div>
              <div className="font-bold">{appointment.description}</div>
              <div className="text-sm text-gray-500">{appointment.date}</div>
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
                  <Button variant="secondary">Edit</Button>
                  <Button variant="destructive">Cancel</Button>
                </>
              )}
              {appointment.status === "completed" && (
                <Button
                  variant="secondary"
                  onClick={() => handleViewClick(appointment)}
                >
                  View
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedAppointment && (
        <div className="p-4 border rounded bg-neutral-100 mt-4">
          <h2 className="text-xl font-bold mb-2">Appointment Details</h2>
          <p>
            <strong>Description:</strong> {selectedAppointment.description}
          </p>
          <p>
            <strong>Date:</strong> {selectedAppointment.date}
          </p>
          <p>
            <strong>Status:</strong> {selectedAppointment.status}
          </p>
          {/* Add more details as needed */}
          <Button
            variant="secondary"
            onClick={() => setSelectedAppointment(null)}
          >
            Close
          </Button>
        </div>
      )}
    </div>
  );
}
