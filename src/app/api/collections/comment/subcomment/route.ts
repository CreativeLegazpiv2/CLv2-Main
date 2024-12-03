// api/collections/comment/subcomment


import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabaseClient';

export async function POST(req: Request) {
  try {
    // Extract galleryid, userid, and comment from headers
    const commentid = req.headers.get('x_galleryid');
    const userid = req.headers.get('x_userid');
    const comment = req.headers.get('x_comment');
    const Fname = req.headers.get('Fname');

    // Check if all required data is present
    if (!commentid || !userid || !comment) {
      return NextResponse.json({ error: 'galleryid, userid, and comment are required' }, { status: 400 });
    }

    // Insert the comment into the gallery_comments table
    const { data, error } = await supabase
      .from('gallery_subcomments')
      .insert([
        {
          Fname: Fname,
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
      // Extract galleryid and commentid from headers
      const galleryid = req.headers.get('x_galleryid');
      const commentid = req.headers.get('x_commentid');
  
      // Check if galleryid and commentid are provided
      if (!galleryid || !commentid) {
        return NextResponse.json({ error: 'galleryid and commentid are required' }, { status: 400 });
      }
  
      // Fetch all subcomments for the given galleryid and commentid
      const { data, error } = await supabase
        .from('gallery_subcomments')
        .select('*')
        .eq('commentid', commentid)
        .order('created_at', { ascending: false }); // Order by created_at (latest first)
  
      // Handle error if fetching fails
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
  
      // Respond with the fetched subcomments
      return NextResponse.json({ comments: data }, { status: 200 });
  
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
