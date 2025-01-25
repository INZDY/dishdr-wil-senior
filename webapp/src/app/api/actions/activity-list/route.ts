import getActivities from "@/lib/db/getActivities";
import { NextResponse } from "next/server";

export async function GET() {
  const symptomList = await getActivities();

  return NextResponse.json(symptomList);
}
