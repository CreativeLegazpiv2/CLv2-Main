// pages/api/reset-password.ts

import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabaseClient';
import bcrypt from 'bcryptjs';  // Use bcryptjs instead

export async function POST(req: Request) {
  try {
    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { message: 'Email and new password are required' },
        { status: 400 }
      );
    }

    // Retrieve the user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('id, otp, otp_updated_at, email')
      .eq('email', email)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Hash the new password using bcryptjs
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password and clear OTP and otp_updated_at
    const { error: updateError } = await supabase
      .from('users')
      .update({
        password: hashedPassword,
        otp: null,
        otp_updated_at: null,
      })
      .eq('email', email);

    if (updateError) {
      return NextResponse.json(
        { message: 'Failed to update password' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Password updated successfully' },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: 'Internal Server Error', error: err.message },
      { status: 500 }
    );
  }
}
