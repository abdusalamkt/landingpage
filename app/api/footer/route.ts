import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Parse the JSON body from frontend
    const body = await req.json();

    // Validate required fields
    const { name, email, phone, message } = body;
    if (!name || !email || !phone) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send data to Google Apps Script Web App
    const res = await fetch(process.env.FOOTER_FORM_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: process.env.FOOTER_FORM_SECRET, // your env key
        name,
        email,
        phone,
        message,
      }),
    });

    const data = await res.json();

    // Return the response from Google Script
    return NextResponse.json(data);

  } catch (err: any) {
    console.error("Error in API route /footer:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
