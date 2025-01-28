import getSymptoms from "@/lib/db/getSymptoms";
import { NextResponse } from "next/server";

export async function GET() {
  const symptomList = await getSymptoms();

  return NextResponse.json(symptomList);
}
