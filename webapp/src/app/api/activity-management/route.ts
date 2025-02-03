import getCurrentUser from "@/lib/db/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { appointmentId, department, status } = body;

    if (!currentUser?.id || currentUser.role !== "staff") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const editedAppointment = await prisma.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        department: department,
        status: status,
      },
    });

    if (!editedAppointment) {
      return new NextResponse("Internal Server Error", { status: 500 });
    }

    return NextResponse.json(editedAppointment, { status: 200 });
  } catch (error) {
    console.log(error, "ERROR_ACTIVITYMANAGEMENT");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
