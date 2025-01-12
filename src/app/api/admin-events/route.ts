import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabaseClient';

export async function GET() {
  try {
    const { data: events, error } = await supabase
      .from("admin_events")
      .select("id, title, date, start_time, end_time, image_path");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(events || [], { status: 200 });
  } catch (err) {
    console.error("Error fetching events:", err);
    return NextResponse.json(
      { error: "An error occurred while fetching events." },
      { status: 500 }
    );
  }
}

  

  export async function PUT(req: Request) {
    try {
      // Parse the JSON body from the request
      const { id, status } = await req.json();
  
      // Update the "admin_events" table
      const { data, error } = await supabase
        .from('admin_events')
        .update({ status }) // Update status
        .eq('id', id);      // Where id matches
  
      // Handle any potential errors
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
  
      // Respond with the updated data
      return NextResponse.json(data || [], { status: 200 });
    } catch (err) {
      console.error('Error updating events:', err); // Log the error for debugging
      return NextResponse.json({ error: 'An error occurred while updating events.' }, { status: 500 });
    }
  }


  export async function POST(req: Request) {
    try {
      // Parse the JSON body from the request
      const { EventID, eventData } = await req.json();
  
      // Ensure EventID and eventData are provided
      if (!EventID || !eventData) {
        return NextResponse.json({ error: "Missing required data" }, { status: 400 });
      }
  
      // Insert the event data into the "register_events" table
      const { data, error } = await supabase
        .from("register_events")
        .insert([
          {
            eventID: EventID, // Insert EventID
            first_name: eventData.firstName,
            last_name: eventData.lastName,
            email: eventData.email,
            phoneNum: eventData.contact,
            gender: eventData.gender,
            artExp: eventData.artExp,
            subjectExp: eventData.subjectExp,
            portfolioLink: eventData.portfolioLink,
            fb: eventData.fb, // Add Facebook field
            ig: eventData.ig, // Add Instagram field
          },
        ]);
  
      // Handle any potential errors
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
  
      // Respond with the inserted data
      return NextResponse.json(data || [], { status: 201 });
    } catch (err) {
      console.error("Error registering event:", err); // Log the error for debugging
      return NextResponse.json(
        { error: "An error occurred while registering the event." },
        { status: 500 }
      );
    }
  }