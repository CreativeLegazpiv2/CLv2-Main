import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabaseClient';

export async function POST(req: Request) {
  const userId = req.headers.get('User-ID'); // Extract user ID from custom header

  if (!userId) {
    return NextResponse.json({ message: 'User ID or Authorization header is missing' }, { status: 401 });
  }

  try {
    const { event_title, event_location, start_time, end_time, selected_date, description } = await req.json();

    // Insert into Supabase
    const { error } = await supabase
      .from('creative_events')
      .insert({
        created_at: new Date(),
        event_title,
        event_location,
        start_time,
        end_time,
        selected_date,
        description,
        user_id: userId, // Use the extracted user ID
      });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Event inserted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error verifying token:', error);
    return NextResponse.json({ message: 'Failed to verify token' }, { status: 401 });
  }
}

export async function GET(req: Request) {
  const userId = req.headers.get('User-ID'); // Extract user ID from custom header

  if (!userId) {
    return NextResponse.json(
      { message: 'User ID header is missing' },
      { status: 401 }
    );
  }

  try {
    // Fetch all events for the user from Supabase
    const { data, error } = await supabase
      .from('creative_events')
      .select('*')
      .eq('user_id', userId); // Filter by user_id

    if (error) {
      return NextResponse.json(
        { message: `Error fetching events: ${error.message}` },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { message: 'No events found for the user.' },
        { status: 204 } // No Content
      );
    }

    return NextResponse.json(data, { status: 200 }); // Return the fetched data
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { message: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}




export async function PUT(req: Request) {
  const userId = req.headers.get('User-ID');

  if (!userId) {
    console.log('User ID is missing');
    return NextResponse.json({ message: 'User ID is missing' }, { status: 401 });
  }

  try {
    const { id, event_title, event_location, start_time, end_time, selected_date, description } = await req.json();

    if (!id || !event_title || !event_location) {
      console.log('Missing required fields:', { id, event_title, event_location });
      return NextResponse.json({ message: 'Missing required fields: id, event_title, or event_location' }, { status: 400 });
    }

    const { error } = await supabase
      .from('creative_events')
      .update({
        event_title,
        event_location,
        start_time,
        end_time,
        selected_date,
        description,
      })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.log('Error updating event:', error.message);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Event updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ message: 'Failed to update event' }, { status: 500 });
  }
}



