import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Validation
    const requiredFields = ['firstName','lastName','email','mobile','cvBase64','cvName','secret'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ success: false, message: `${field} is required` }, { status: 400 });
      }
    }

    // ✅ Google Apps Script endpoint
    const SCRIPT_URL = process.env.APPLY_FORM_URL;
    const SECRET_KEY = process.env.APPLY_FORM_SECRET;

    const gsResponse = await fetch(SCRIPT_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mobile: data.mobile,
        jobTitle: data.jobTitle || "N/A",
        cvBase64: data.cvBase64,
        cvName: data.cvName,
        secret: SECRET_KEY
      })
    });

    const result = await gsResponse.json();

    if (result.success) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: result.message || 'Submission failed' });

  } catch (error) {
    console.error('Apply API error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
