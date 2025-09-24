import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }

    // ✅ Example: send to Google Sheet (change URL + SECRET_KEY accordingly)
    const gsResponse = await fetch(process.env.NEWSLETTER_FORM_URL as string, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
  secret: process.env.NEWSLETTER_FORM_SECRET,  
  email,                                       
}),

    });

    const data = await gsResponse.json();

    if (data.success) {
  return NextResponse.json({ success: true });
}

return NextResponse.json({ success: false, message: data.message || 'Failed to subscribe' });

  } catch (error) {
    console.error('Newsletter API error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
