import { supabase } from '@/services/supabaseClient';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  try {
    // Parse the request body to get userId, galleryId, and fetchOnly
    const { userId, galleryId, fetchOnly } = await request.json();

    if (!galleryId) {
      return NextResponse.json({ success: false, error: 'galleryId is required' }, { status: 400 });
    }

    // Fetch the current userLiked array for the given galleryId
    let { data, error } = await supabase
      .from('galleryLikes')
      .select('userLiked')
      .eq('galleryId', galleryId)
      .single();

    if (error) {
      // If no rows are returned, create a new entry
      if (error.code === 'PGRST116') {
        const { error: insertError } = await supabase
          .from('galleryLikes')
          .insert({ galleryId, userLiked: [] });

        if (insertError) {
          throw new Error(insertError.message);
        }

        data = { userLiked: [] };
      } else {
        throw new Error(error.message);
      }
    }

    // Check if the userLiked array exists and if userId is already in it
    const userLikedArray = data?.userLiked || [];

    if (!fetchOnly) {
      // If fetchOnly is false, update the like status
      const userIdIndex = userLikedArray.indexOf(userId);

      if (userIdIndex !== -1) {
        // If userId exists, remove it from the array
        userLikedArray.splice(userIdIndex, 1);
      } else {
        // If userId does not exist, add it to the array
        userLikedArray.push(userId);
      }

      // Update the galleryLikes table with the modified userLiked array
      const { error: updateError } = await supabase
        .from('galleryLikes')
        .update({ userLiked: userLikedArray })
        .eq('galleryId', galleryId);

      if (updateError) {
        throw new Error(updateError.message);
      }
    }

    // Calculate the count of likes
    const likeCount = userLikedArray.length;

    // Return the userLiked array and the like count in the response
    return NextResponse.json({ success: true, userLiked: userLikedArray, likeCount });
  } catch (error: any) {
    // Return an error response
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}