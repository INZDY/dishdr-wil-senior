import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const currentUser = { id: "JohnDoeId" };
    const body = await request.json();
    const { sessionId, inquiries } = body;

    // user check
    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
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

    // Simulate server wait time
    await new Promise((resolve) => setTimeout(resolve, 700));
    // dummy data
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
    console.log(error, "ERROR_SUBMITANSWER");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
