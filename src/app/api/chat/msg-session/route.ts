import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabaseClient';

export async function POST(req: Request) {
  try {
    // Extract sender_a and sender_b from the request body
    const body = await req.json();
    const { sender_a, sender_b, message, image_path } = body;

    if (!sender_a || !sender_b) {
      return NextResponse.json({ error: 'sender_a and sender_b are required' }, { status: 400 });
    }

    if (!message) {
      return NextResponse.json({ error: 'message is required' }, { status: 400 });
    }

    // Check if the conversation already exists in msgSession
    const { data: existingSession, error: sessionError } = await supabase
      .from('msgSession')
      .select('id')
      .or(`and(a.eq.${sender_a},b.eq.${sender_b}),and(a.eq.${sender_b},b.eq.${sender_a})`)
      .order('created_at', { ascending: false });

    if (sessionError) {
      throw new Error(sessionError.message);
    }

    let sessionId;

    if (existingSession.length > 0) {
      // Use the existing session ID
      sessionId = existingSession[0].id;

      // Update created_at to reflect the latest message
      const { error: updateError } = await supabase
        .from('msgSession')
        .update({ created_at: new Date().toISOString() })
        .eq('id', sessionId);

      if (updateError) {
        throw new Error(updateError.message);
      }
    } else {
      // Insert into msgSession table if session doesn't exist
      const { data: sessionData, error: insertError } = await supabase
        .from('msgSession')
        .insert([{ a: sender_a, b: sender_b, created_at: new Date().toISOString() }])
        .select('id');

      if (insertError) {
        throw new Error(insertError.message);
      }

      sessionId = sessionData[0].id;
    }

    // Insert the new message into allmessage table
    const { error: messageError } = await supabase
      .from('allmessage')
      .insert([{ sessionid: sessionId, message, sender: sender_a, image_path }]);

    if (messageError) {
      throw new Error(messageError.message);
    }

    return NextResponse.json({ success: true, sessionId }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const headers = req.headers;
    const sender_a = headers.get('sender_a');
    const sender_b = headers.get('sender_b');

    if (!sender_a || !sender_b) {
      return NextResponse.json({ error: 'sender_a and sender_b are required' }, { status: 400 });
    }

    // Query msgSession to find the session between sender_a and sender_b
    const { data: sessions, error: sessionsError } = await supabase
      .from('msgSession')
      .select('id')
      .or(`and(a.eq.${sender_a},b.eq.${sender_b}),and(a.eq.${sender_b},b.eq.${sender_a})`)
      .order('created_at', { ascending: false });

    if (sessionsError) {
      throw new Error(sessionsError.message);
    }

    // Fetch all messages for the session
    const messagesPromises = sessions.map(async (session) => {
      const { data: messages, error: messagesError } = await supabase
        .from('allmessage')
        .select('*')
        .eq('sessionid', session.id)

      if (messagesError) {
        throw new Error(messagesError.message);
      }

      return { session, messages };
    });

    const messagesData = await Promise.all(messagesPromises);

    // Ensure session IDs match with messages
    const filteredMessagesData = messagesData.filter(({ session, messages }) =>
      messages.every(message => message.sessionid === session.id)
    );

    return NextResponse.json({ sessions: filteredMessagesData }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
