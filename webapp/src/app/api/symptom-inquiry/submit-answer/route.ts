import getCurrentUser from "@/lib/db/getCurrentUser";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { session_id, symptoms } = body;

    // user check
    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = currentUser.id;

    const flaskResponse = await fetch("http://127.0.0.1:5000/predict", {
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
    // format {_id, response: {question / {response 1, response 2}}}

    // Simulate server wait time
    // await new Promise((resolve) => setTimeout(resolve, 700));
    // dummy data
    // const data = {
    //   sessionId: "JohnDoeId",
    //   question: "question x",
    //   department: "",
    // };

    return NextResponse.json(data);
  } catch (error) {
    console.log(error, "ERROR_SUBMITANSWER");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
