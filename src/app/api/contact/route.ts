import { NextRequest, NextResponse } from 'next/server';

const WHATSAPP_API_VERSION = 'v21.0';
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_RECIPIENT_NUMBER = process.env.WHATSAPP_RECIPIENT_NUMBER;

interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  message: string;
}

function buildWhatsAppMessage({ name, email, phone, message }: ContactPayload) {
  return (
    `📩 *New Contact Form Submission*\n\n` +
    `*Name:* ${name}\n` +
    `*Email:* ${email}\n` +
    `*Phone:* ${phone || 'Not provided'}\n\n` +
    `*Message:*\n${message}`
  );
}

async function sendWhatsAppMessage(payload: ContactPayload) {
  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_RECIPIENT_NUMBER) {
    throw new Error('WhatsApp API credentials are not configured');
  }

  const url = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: WHATSAPP_RECIPIENT_NUMBER,
      type: 'text',
      text: {
        preview_url: false,
        body: buildWhatsAppMessage(payload),
      },
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    console.error('WhatsApp API error:', errorData);
    throw new Error('Failed to send WhatsApp message');
  }

  return res.json();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body as ContactPayload;

    // Server-side validation (never trust client alone)
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    await sendWhatsAppMessage({ name, email, phone, message });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}import { NextRequest, NextResponse } from 'next/server';

const WHATSAPP_API_VERSION = 'v21.0';
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_RECIPIENT_NUMBER = process.env.WHATSAPP_RECIPIENT_NUMBER;

interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  message: string;
}

function buildWhatsAppMessage({ name, email, phone, message }: ContactPayload) {
  return (
    `📩 *New Contact Form Submission*\n\n` +
    `*Name:* ${name}\n` +
    `*Email:* ${email}\n` +
    `*Phone:* ${phone || 'Not provided'}\n\n` +
    `*Message:*\n${message}`
  );
}

async function sendWhatsAppMessage(payload: ContactPayload) {
  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_RECIPIENT_NUMBER) {
    throw new Error('WhatsApp API credentials are not configured');
  }

  const url = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: WHATSAPP_RECIPIENT_NUMBER,
      type: 'text',
      text: {
        preview_url: false,
        body: buildWhatsAppMessage(payload),
      },
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    console.error('WhatsApp API error:', errorData);
    throw new Error('Failed to send WhatsApp message');
  }

  return res.json();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body as ContactPayload;

    // Server-side validation (never trust client alone)
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    await sendWhatsAppMessage({ name, email, phone, message });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}