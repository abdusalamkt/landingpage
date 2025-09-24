import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(process.env.GATED_DOWNLOAD_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...body,
        secret: process.env.GATED_DOWNLOAD_SECRET
      }),
    });

    const data = await res.json();
    return NextResponse.json(data);

  } catch (err: any) {
    console.error("Error submitting gated download form:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
