// api/chat/new-msg

import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabaseClient';


export async function POST(req: Request) {
  try {
    // Extract sender_a and sender_b from the request body
    const body = await req.json();
    const { sender_a, sender_b } = body;

    if (!sender_a || !sender_b) {
      return NextResponse.json({ error: 'sender_a and sender_b are required' }, { status: 400 });
    }

    // Check if the conversation already exists in msgSession
    const { data: existingSession, error: sessionError } = await supabase
      .from('msgSession')
      .select('id, a, b')
      .or(`a.eq.${sender_a},b.eq.${sender_a}`)
      .or(`a.eq.${sender_b},b.eq.${sender_b}`);

    if (sessionError) {
      throw new Error(sessionError.message);
    }

    if (existingSession.length > 0) {
      // Conversation already exists, return the existing session ID
      return NextResponse.json({ success: true, sessionId: existingSession[0].id, a: existingSession[0].a, b: existingSession[0].b }, { status: 200 });
    } else {
      // Insert into msgSession table
      const { data: sessionData, error: insertError } = await supabase
        .from('msgSession')
        .insert([
          { a: sender_a, b: sender_b }
        ])
        .select('id, a, b'); // Select the inserted ID

      if (insertError) {
        throw new Error(insertError.message);
      }

      if (sessionData.length > 0) {
        return NextResponse.json({ success: true, sessionId: sessionData[0].id, a: sessionData[0].a, b: sessionData[0].b }, { status: 201 });
      } else {
        throw new Error('Failed to retrieve the inserted session ID');
      }
    }
  } catch (error:any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function GET(req: Request) {
  try {
    // Extract the tokenid from the request headers
    const tokenid = req.headers.get('tokenid');

    if (!tokenid) {
      return NextResponse.json({ error: 'tokenid is required in headers' }, { status: 400 });
    }

    // Query the Supabase database to fetch user details where detailsid != tokenid
    const { data, error } = await supabase
      .from('userDetails')
      .select('*')
      .neq('detailsid', tokenid);

    if (error) {
      throw error;
    }

    // Return the fetched data as a JSON response
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching user details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}