// api/collections/comment/delete/route.ts

import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabaseClient';

export async function DELETE(req: Request) {
  try {
    // Parse the request to extract x_commentid and x_userid
    const  x_commentid  = req.headers.get('x_commentid');
    const userid = req.headers.get('x_userid');

    // Validate if x_commentid and x_userid are provided
    if (!x_commentid || !userid) {
      return NextResponse.json(
        { message: 'Missing x_commentid or x_userid' },
        { status: 400 }
      );
    }

    // Query the gallery_comments table to find the comment by x_commentid and match the user
    const { data, error } = await supabase
      .from('gallery_subcomments')
      .select('id, userid') // Assuming `user_id` is the field for the owner of the comment
      .eq('id', x_commentid)
      .single();

    // Handle errors, such as comment not found
    if (error || !data) {
      return NextResponse.json(
        { message: 'Comment not found' },
        { status: 404 }
      );
    }

    // Ensure that the user trying to delete the comment is the owner
    if (data.userid != userid) {
      return NextResponse.json(
        { message: 'Unauthorized to delete this comment' },
        { status: 403 }
      );
    }

    // Proceed to delete the comment from the gallery_comments table
    const { error: deleteError } = await supabase
      .from('gallery_subcomments')
      .delete()
      .eq('id', x_commentid);

    if (deleteError) {
      return NextResponse.json(
        { message: 'Failed to delete the comment', error: deleteError.message },
        { status: 500 }
      );
    }

    // Successfully deleted
    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    return NextResponse.json(
      { message: 'Server error', error: err },
      { status: 500 }
    );
  }
}
