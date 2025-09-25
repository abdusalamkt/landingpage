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
        secret: process.env.REQUEST_SERVICE_FORM_SECRET,
      }),
    });

    let data: any = {};
    try {
      data = await res.json();
    } catch {
      data = { success: false, message: "Invalid response from Google Apps Script" };
    }

    return NextResponse.json({
      success: !!data.success,
      message: data.message || (data.success ? "Submitted" : "Failed to submit request"),
    });
  } catch (err: any) {
    console.error("Request Service API error:", err);
    return NextResponse.json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
}
