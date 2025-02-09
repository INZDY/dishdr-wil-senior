import getDepartments from "@/lib/db/getDepartments";
import { NextResponse } from "next/server";

export async function GET() {
  const departmentList = await getDepartments();

  return NextResponse.json(departmentList);
}
