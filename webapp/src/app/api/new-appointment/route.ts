import { prisma } from "@/lib/prisma";
import { SymptomAnswer } from "@/types/dataTypes";
import { AppointmentSymptoms } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // John Doe is the current user
    const currentUser = { id: "m5xvlaj522ldwmn3q3rr0m8l" };
    const body = await request.json();
    const {
      name,
      dateOfBirth,
      height,
      weight,
      email,
      phone,
      chronicDiseases,
      allergies,
      department,
      date,
      time,
      status,
      chiefComplaint,
      presentIllness,
      inquiries,
      prediction,
      notes,
    } = body;
    const appointmentDateTime = new Date(`${date} ${time}`);

    // user check
    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    //create new appointment
    const newAppointment = await prisma.appointment.create({
      data: {
        appointmentName: `Appointment on ${date} ${time}`,
        patientId: currentUser.id,
        department,
        dateTime: appointmentDateTime,
        notes,
        status: status || "pending",
        // otherSymptoms: symptoms,
        prediction,
        symptoms: {
          createMany: {
            data: [
              ...inquiries.map(
                (
                  illness: Omit<AppointmentSymptoms, "id" | "appointmentId">
                ) => ({
                  type: illness.type,
                  symptom: illness.symptom,
                  duration: illness.duration,
                  unit: illness.unit,
                  hasSymptom: illness.hasSymptom,
                  isOther: illness.isOther,
                })
              ),
            ],
          },
        },
      },
    });

    return NextResponse.json(newAppointment);
  } catch (error: any) {
    console.log(error, "ERROR_NEWAPPOINTMENT");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
