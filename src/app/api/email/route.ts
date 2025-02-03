import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabaseClient';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
const sendgridVerifiedEmail = process.env.SENDGRID_SENDER as string;

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    console.log('Received email:', email);

    // Step 1: Fetch user and check last OTP update time
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('otp_updated_at')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }

    const lastUpdated = user.otp_updated_at ? new Date(user.otp_updated_at) : null;
    const now = new Date();
    
    if (lastUpdated && now.getTime() - lastUpdated.getTime() < 3 * 60 * 1000) {
      return NextResponse.json({ error: 'OTP can only be updated after 3 minutes' }, { status: 429 });
    }

    // Step 2: Generate a unique 6-digit OTP
    let otp: string = '';
    let otpExists = true;

    while (otpExists) {
      otp = Math.floor(100000 + Math.random() * 900000).toString();
      const { data: existingOtp, error: otpError } = await supabase
        .from('users')
        .select('otp')
        .eq('otp', otp);

      if (otpError) {
        console.error('Error checking OTP uniqueness', otpError);
        return NextResponse.json({ error: 'Error checking OTP uniqueness' }, { status: 500 });
      }

      otpExists = existingOtp.length > 0;
    }

    // Step 3: Update OTP and timestamp in the database
    const { error: updateError } = await supabase
      .from('users')
      .update({ otp, otp_updated_at: now.toISOString() })
      .eq('email', email);

    if (updateError) {
      console.error('Failed to update OTP', updateError);
      return NextResponse.json({ error: 'Failed to update OTP' }, { status: 500 });
    }

    // Step 4: Send the OTP email
    const msg = {
      to: email,
      from: sendgridVerifiedEmail,
      subject: 'Your OTP for Password Reset',
      text: `Your OTP is: ${otp}`,
      html: `<p>Your OTP is: <strong>${otp}</strong></p>`,
    };

    await sgMail.send(msg);

    return NextResponse.json({ message: 'OTP sent to your email' }, { status: 200 });

  } catch (error) {
    console.error('Error in OTP generation process:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
