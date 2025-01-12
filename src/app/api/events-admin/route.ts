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