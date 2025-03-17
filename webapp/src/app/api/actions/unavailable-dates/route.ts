import getCurrentUser from "@/lib/db/getCurrentUser";
// import getUnavailableDates from "@/lib/db/getUnAvailableDates";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const MAX_SLOTS_PER_DAY = 2;

export async function POST(request: NextRequest) {
  // const availableDates = await getUnavailableDates();
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { department } = body;

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (department === "") {
      return new NextResponse("Invalid params", { status: 400 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);
    next30Days.setHours(0, 0, 0, 0);

    const unavailableDates = await prisma.appointment.groupBy({
      by: ["dateOnly"],
      _count: { dateTime: true },
      where: {
        department: department as string,
        dateTime: {
          gte: today,
          // use if limit booking to 30 days
          // lte: next30Days,
        },
        dateOnly: { not: "" },
      },
      having: {
        dateTime: {
          _count: { gte: MAX_SLOTS_PER_DAY },
        },
      },
    });

    return NextResponse.json(unavailableDates);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
