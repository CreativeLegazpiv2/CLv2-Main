// api/collections/comment


import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabaseClient';

export async function POST(req: Request) {
  try {
    // Extract galleryid, userid, and comment from headers
    const galleryid = req.headers.get('x_galleryid');
    const userid = req.headers.get('x_userid');
    const comment = req.headers.get('x_comment');

    // Check if all required data is present
    if (!galleryid || !userid || !comment) {
      return NextResponse.json({ error: 'galleryid, userid, and comment are required' }, { status: 400 });
    }

    // Insert the comment into the gallery_comments table
    const { data, error } = await supabase
      .from('gallery_comments')
      .insert([
        {
          galleryid,
          userid,
          comment,
          created_at: new Date().toISOString(), // Add created_at field
        },
      ]);

    // Handle error if the insertion fails
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Respond with the inserted data
    return NextResponse.json({ data }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    // Extract galleryid from headers
    const galleryid = req.headers.get('x_galleryid');

    // Check if galleryid is provided
    if (!galleryid) {
      return NextResponse.json({ error: 'galleryid is required' }, { status: 400 });
    }

    // Fetch all comments for the given galleryid
    const { data: comments, error: commentsError } = await supabase
      .from('gallery_comments')
      .select('*')
      .eq('galleryid', galleryid)
      .order('created_at', { ascending: false }); // Order by created_at (latest first)

    // Handle error if fetching comments fails
    if (commentsError) {
      return NextResponse.json({ error: commentsError.message }, { status: 500 });
    }

    // Extract userids from comments
    const userids = comments.map(comment => comment.userid);

    // Fetch user details for the extracted userids
    const { data: userDetails, error: userDetailsError } = await supabase
      .from('userDetails')
      .select('*')
      .in('detailsid', userids);

    // Handle error if fetching user details fails
    if (userDetailsError) {
      return NextResponse.json({ error: userDetailsError.message }, { status: 500 });
    }

    // Combine comments with their respective user details
    const commentsWithUserDetails = comments.map(comment => {
      const userDetail = userDetails.find(detail => detail.detailsid === comment.userid);
      return {
        ...comment,
        userDetails: userDetail || null, // Include user details if found, otherwise null
      };
    });

    // Respond with the combined data
    return NextResponse.json({ comments: commentsWithUserDetails }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
