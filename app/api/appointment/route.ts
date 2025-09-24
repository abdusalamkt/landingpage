import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(process.env.APPOINTMENT_FORM_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...body,
        secret: process.env.APPOINTMENT_FORM_SECRET
      }),
    });

    const text = await res.text(); // get raw text
    let data;
    try {
      data = JSON.parse(text); // try parse as JSON
    } catch (err) {
      console.error("Failed to parse response from Apps Script:", text);
      data = { success: false, message: "Invalid response from server" };
    }

    return NextResponse.json(data);

  } catch (err: any) {
    console.error("Error submitting appointment form:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
