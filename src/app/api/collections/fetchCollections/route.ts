import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabaseClient';

export async function GET(req: Request) {
  try {
    // Extract the 'id' from the request headers
    const id = req.headers.get('x_id');  // Replace 'x-id' with the correct header name you're using

    if (!id) {
      return NextResponse.json({ error: 'ID is required in the headers' }, { status: 400 });
    }

    // Query the child_collection from Supabase where childid is NOT equal to the provided id
    const { data, error } = await supabase
      .from('child_collection')
      .select('*')
      .neq('childid', id); 

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
