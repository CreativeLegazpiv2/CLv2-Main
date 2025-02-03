import { NextResponse } from 'next/server';
import sgMail, { MailDataRequired } from '@sendgrid/mail';
import { SendEmailParams } from '@/services/email/emailService';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string); // Ensure SendGrid API key is in .env

export async function POST(req: Request) {
  try {
    // Parse the incoming request body
    const emailData: SendEmailParams = await req.json();

    const { to, subject, text, html } = emailData;

    // Validate required fields
    if (!to || !subject || (!text && !html)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Prepare the email message
    const msg: MailDataRequired = {
      to,
      from: process.env.SENDGRID_SENDER as string, // Ensure this is a verified sender in SendGrid
      subject,
      content: [
        {
          type: html ? 'text/html' : 'text/plain',
          value: html ?? text ?? '',
        },
      ],
    };

    // Send the email using SendGrid
    await sgMail.send(msg);

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error:', error);
    const errorDetails = error.response?.body || error.message || 'Unknown error';
    return NextResponse.json({ error: 'Failed to send email', details: errorDetails }, { status: 500 });
  }
}
