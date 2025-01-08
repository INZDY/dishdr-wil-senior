import { NextResponse } from "next/server";
import React from "react";

export async function POST(request: Request) {
  try {
    const currentUser = { id: "JohnDoeId" };
    const body = await request.json();
    const { sessionId, inquiries } = body;

    // user check
    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Simulate server wait time
    await new Promise((resolve) => setTimeout(resolve, 3000)); // 2 seconds delay

    // const flaskResponse = await fetch("http://flask-server/predict", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ sessionId, inquiries }),
    // });

    // if (!flaskResponse.ok) {
    //   throw new Error("Failed to get prediction from Flask server");
    // }

    // const data = await flaskResponse.json();

    const data = {
      sessionId: "JohnDoeId",
      question: "question x",
      department: "",
    };

    return NextResponse.json({
      sessionId: data.sessionId,
      question: data.question,
      department: data.department,
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
