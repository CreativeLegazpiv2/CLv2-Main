import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabaseClient';

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    // Validate input
    if (!email || !otp) {
      return NextResponse.json({ success: false, message: 'Email and OTP are required' }, { status: 400 });
    }

    // Fetch OTP from the database
    const { data, error } = await supabase
      .from('users')
      .select('otp')
      .eq('email', email)
      .single();

    // Handle errors if OTP does not exist or if email is not found
    if (error || !data) {
      return NextResponse.json({ success: false, message: 'Invalid email or OTP' }, { status: 400 });
    }

    // Normalize and check if OTP matches
    if (String(data.otp).trim() !== String(otp).trim()) {
      return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 400 });
    }

    // Success response if OTP is valid
    return NextResponse.json({ success: true, message: 'OTP is valid' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
