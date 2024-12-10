
import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabaseClient';

export async function GET(req: Request) {
    try {
      const headers = req.headers;
      const sender_a = headers.get('sender_a');
      const sender_b = headers.get('sender_b');
  
      if (!sender_a || !sender_b) {
        return NextResponse.json({ error: 'sender_a and sender_b are required' }, { status: 400 });
      }
  
      // Query the msgSession table for sessions where sender_a and sender_b exist
      const { data: sessions, error: sessionsError } = await supabase
        .from('msgSession')
        .select('id')
        .or(`and(a.eq.${sender_a},b.eq.${sender_b}),and(a.eq.${sender_b},b.eq.${sender_a})`);
  
      if (sessionsError) {
        throw new Error(sessionsError.message);
      }
  
      // If no sessions found, return a 404 error
      if (sessions.length === 0) {
        return NextResponse.json({ error: 'No session found for the given sender pair' }, { status: 404 });
      }
  
      // Extract session ids from the sessions array
      const sessionIds = sessions.map(session => session.id);
  
      // Query the allmessage table for messages where session_id matches
      const { data: filteredMessagesData, error: messagesError } = await supabase
        .from('allmessage')
        .select('*')
        .in('sessionid', sessionIds);
  
      if (messagesError) {
        throw new Error(messagesError.message);
      }
  
      // Return the messages
      return NextResponse.json({ sessions: filteredMessagesData }, { status: 200 });
  
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }