import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabaseClient'; // adjust the path to your supabase client

// This function handles GET requests
export async function GET(req: Request) {
  try {
    // Extract 'detailsid' from the request headers
    const detailsid = req.headers.get('dynamicId');
    
    // Check if the 'detailsid' is provided
    if (!detailsid) {
      return NextResponse.json({ error: 'Missing detailsid in headers' }, { status: 400 });
    }

    // Query the supabase database to fetch user details where 'detailsid' matches
    const { data, error } = await supabase
      .from('userDetails')
      .select('*')
      .eq('detailsid', detailsid)  // Filter by 'detailsid'
      .single();  // Ensure we only get one row (or none if not found)

    // Handle potential errors during the query
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If no data is found, respond with a 404
    if (!data) {
      return NextResponse.json({ error: 'User details not found' }, { status: 404 });
    }

    // Return the fetched data
    return NextResponse.json({ data }, { status: 200 });

  } catch (error) {
    // General error handling
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
