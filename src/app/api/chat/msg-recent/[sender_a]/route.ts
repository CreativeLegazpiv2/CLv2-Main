import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/services/supabaseClient';

export async function GET(req: NextRequest) {
  try {
    // Access the dynamic parameter `sender_a` from the URL
    const sender_a = req.nextUrl.pathname.split('/')[4]; // Extract sender_a from the URL path

    if (!sender_a) {
      return NextResponse.json({ error: 'sender_a is required' }, { status: 400 });
    }

    // Fetch sessions from Supabase
    const { data: sessions, error: sessionsError } = await supabase
      .from('msgSession')
      .select('id, a, b')
      .or(`a.eq.${sender_a},b.eq.${sender_a}`);

    if (sessionsError) {
      throw new Error(sessionsError.message);
    }

    // Fetch user details for each session
    const userDetailsPromises = sessions.map(async (session) => {
      const otherUserId = session.a == sender_a ? session.b : session.a;

      const { data: userDetails, error: userDetailsError } = await supabase
        .from('userDetails')
        .select('first_name, creative_field, role, profile_pic')
        .eq('detailsid', otherUserId);

      if (userDetailsError) {
        throw new Error(userDetailsError.message);
      }

      return userDetails[0];
    });

    const userDetails = await Promise.all(userDetailsPromises);

    // Combine session data with user details
    const combinedData = sessions.map((session, index) => ({
      ...session,
      userDetails: userDetails[index],
    }));

    return NextResponse.json(combinedData);
  } catch (error: any) {
    console.error('Error in GET request:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
