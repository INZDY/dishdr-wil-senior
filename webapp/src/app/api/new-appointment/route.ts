import getCurrentUser from "@/lib/db/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { AppointmentSymptoms } from "@prisma/client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // John Doe is the current user
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const {
      appointmentName,
      dateOnly,
      name,
      hn,
      dateOfBirth,
      height,
      weight,
      email,
      phone,
      chronicDiseases,
      allergies,
      careType,
      department,
      departmentTh,
      dateTime,
      status,
      inquiries,
      predicted,
      prediction,
      predictionTh,
      notes,
    } = body;

    // user check
    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    //create new appointment
    const newAppointment = await prisma.appointment.create({
      data: {
        appointmentName,
        userId: currentUser.id,
        name,
        dob: dateOfBirth === "" ? null : new Date(dateOfBirth),
        height,
        weight,
        email,
        phone,
        chronicDisease: chronicDiseases,
        allergies,
        careType,
        department,
        departmentTh,
        dateTime,
        dateOnly,
        notes,
        status: status || "pending",
        predicted,
        prediction,
        predictionTh,
        symptoms: {
          createMany: {
            data: [
              ...inquiries.map(
                (
                  illness: Omit<AppointmentSymptoms, "id" | "appointmentId">
                ) => ({
                  type: illness.type,
                  symptom: illness.symptom,
                  symptomTh: illness.symptomTh,
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

    const cookieStore = await cookies();
    cookieStore.set("name", name);
    cookieStore.set("hn", hn);
    cookieStore.set("phone", phone);
    cookieStore.set("email", email);

    return NextResponse.json(newAppointment);
  } catch (error: any) {
    console.log(error, "ERROR_NEWAPPOINTMENT");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
