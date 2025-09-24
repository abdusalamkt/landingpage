import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Forward to Google Apps Script
    const res = await fetch(process.env.REQUEST_SERVICE_FORM_URL as string, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...body,
        secret: process.env.REQUEST_SERVICE_FORM_SECRET, // secure secret
      }),
    });

    const data = await res.json();

    if (data.success) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, message: data.message || "Failed to submit request" },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("Request Service API error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
