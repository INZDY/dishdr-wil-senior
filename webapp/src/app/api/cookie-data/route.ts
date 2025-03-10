import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const fields = ["name", "hn", "phone", "email"];
  const cookieStore = (await cookies()).getAll();

  const filtered = cookieStore.filter((item) => fields.includes(item.name));

  const mappedValues = filtered.reduce<Record<string, string>>((acc, item) => {
    acc[item.name] = item?.value;
    return acc;
  }, {});

  return NextResponse.json(mappedValues);
}
