import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabaseClient';

export async function GET(req: Request) {
  try {
    const headers = req.headers;
    const sender_a = headers.get('sender_a');

    if (!sender_a) {
      return NextResponse.json({ error: 'sender_a is required' }, { status: 400 });
    }

    // Query the msgSession table for sessions where sender_a exists in either column a or b
    const { data: sessions, error: sessionsError } = await supabase
      .from('msgSession')
      .select('id, a, b')  // Select id, a, and b fields explicitly
      .or(`a.eq.${sender_a},b.eq.${sender_a}`); // Check if sender_a is in either column a or b  

    if (sessionsError) {
      throw new Error(sessionsError.message);
    }

    // If no sessions are found, return a 404 error
    if (!sessions || sessions.length === 0) {
      return NextResponse.json({ error: 'No sessions found for the provided sender_a' }, { status: 404 });
    }

    // Return only the sessions (no messages)
    return NextResponse.json({ sessions }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
