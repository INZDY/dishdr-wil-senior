import getCurrentUser from "@/lib/db/getCurrentUser";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const flaskAPI = process.env.NEXT_PUBLIC_FLASK_URL;
    // const flaskAPI = process.env.NEXT_PUBLIC_FLASK_URL;
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { session_id, symptoms } = body;

    // user check
    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = currentUser.id;

    const flaskResponse = await fetch(`${flaskAPI}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ session_id: userId, symptoms }),
    });

    if (!flaskResponse.ok) {
      throw new Error("Failed to get prediction from Flask server");
    }

    const data = await flaskResponse.json();
    // format {sessionId, (question / department)}

    return NextResponse.json(data);
  } catch (error) {
    console.log(error, "ERROR_SUBMITANSWER");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
