// api/collections/comment/subcomment


import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabaseClient';

export async function POST(req: Request) {
  try {
    // Extract galleryid, userid, and comment from headers
    const commentid = req.headers.get('x_galleryid');
    const userid = req.headers.get('x_userid');
    const comment = req.headers.get('x_comment');

    // Check if all required data is present
    if (!commentid || !userid || !comment) {
      return NextResponse.json({ error: 'galleryid, userid, and comment are required' }, { status: 400 });
    }

    // Insert the comment into the gallery_comments table
    const { data, error } = await supabase
      .from('gallery_subcomments')
      .insert([
        {
          commentid,
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

    const commentid = req.headers.get('x_commentid');

    // Check if galleryid and commentid are provided
    if (!commentid) {
      return NextResponse.json({ error: 'galleryid and commentid are required' }, { status: 400 });
    }

    // Fetch all subcomments for the given galleryid and commentid
    const { data: subcomments, error: subcommentsError } = await supabase
      .from('gallery_subcomments')
      .select('*')
      .eq('commentid', commentid)
      .order('created_at', { ascending: true }); // Order by created_at (latest first)

    // Handle error if fetching subcomments fails
    if (subcommentsError) {
      return NextResponse.json({ error: subcommentsError.message }, { status: 500 });
    }

    // Extract userids from subcomments
    const userids = subcomments.map(subcomment => subcomment.userid);

    // Fetch user details for the extracted userids
    const { data: userDetails, error: userDetailsError } = await supabase
      .from('userDetails')
      .select('*')
      .in('detailsid', userids);

    // Handle error if fetching user details fails
    if (userDetailsError) {
      return NextResponse.json({ error: userDetailsError.message }, { status: 500 });
    }

    // Combine subcomments with their respective user details
    const subcommentsWithUserDetails = subcomments.map(subcomment => {
      const userDetail = userDetails.find(detail => detail.detailsid === subcomment.userid);
      return {
        ...subcomment,
        userDetails: userDetail || null, // Include user details if found, otherwise null
      };
    });

    // Respond with the combined data
    return NextResponse.json({ comments: subcommentsWithUserDetails }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
