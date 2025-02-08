import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabaseClient';
import { Subscription } from '@supabase/supabase-js'
export async function GET(req: Request) {
  const userId = req.headers.get('Authorization');
  const username = req.headers.get('Append');

  if (!userId || !username) {
    return NextResponse.json({ message: 'User ID is missing' }, { status: 401 });
  }

  try {
    // Fetch messages related to the user
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('id, first_name, message, created_at, for')
      .or(`for.eq.${userId},id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (messagesError) {
      console.error('Supabase fetch error for messages:', messagesError);
      return NextResponse.json({ message: 'Failed to fetch messages', error: messagesError.message }, { status: 500 });
    }

    // Fetch user details where detailsid equals userId
    const { data: userDetails, error: userDetailsError } = await supabase
      .from('userDetails')
      .select('*')
      .eq('detailsid', userId);

    if (userDetailsError) {
      console.error('Supabase fetch error for userDetails:', userDetailsError);
      return NextResponse.json({ message: 'Failed to fetch user details', error: userDetailsError.message }, { status: 500 });
    }

    return NextResponse.json(
      { messages: messages || [], userDetails: userDetails || [] },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ message: 'Error fetching data', error: error.message }, { status: 500 });
  }
}


export async function PUT(req: Request) {
  const userId = req.headers.get('Authorization'); // User ID from the Authorization header

  if (!userId) {
    return NextResponse.json({ message: 'User ID is missing' }, { status: 400 });
  }

  try {
    // Extract the body from the request
    const body = await req.json();
    const { message, forId, first_name, session } = body; // Assuming 'forId' is passed as recipient/thread ID

    if (!message || !forId) {
      return NextResponse.json({ message: 'Message or recipient is missing' }, { status: 400 });
    }

    // Insert the new message into the 'messages' table
    const { data: insertData, error: insertError } = await supabase
      .from('messages')
      .insert([ 
        {
          id: userId,
          first_name: first_name, 
          message: message, 
          for: forId,
          session:session,
          created_at: new Date().toISOString(),
        }
      ]);

    if (insertError) {
      console.error('Error inserting message:', insertError);
      return NextResponse.json({ message: 'Failed to insert message', error: insertError.message }, { status: 500 });
    }

    // Fetch updated messages after insertion
    const { data: updatedMessages, error: fetchError } = await supabase
    .from('messages')
    .select('id, first_name, message, created_at, for')
    .or(`for.eq.${userId},id.eq.${userId}`)
    .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching updated messages:', fetchError);
      return NextResponse.json({ message: 'Failed to fetch updated messages', error: fetchError.message }, { status: 500 });
    }

    return NextResponse.json({ data: updatedMessages }, { status: 200 });
  } catch (error: any) {
    console.error('Error inserting message:', error);
    return NextResponse.json({ message: 'Error inserting message', error: error.message }, { status: 500 });
  }
}