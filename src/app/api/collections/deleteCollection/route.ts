import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabaseClient';

export async function DELETE(req: Request) {
  try {
    const { generatedId, userId, image_path } = await req.json();

    if (!generatedId || !userId) {
      return NextResponse.json({ error: 'generatedId and userId are required' }, { status: 400 });
    }

    // Fetch the child record before deleting it
    const { data: childRecord, error: fetchError } = await supabase
      .from('child_collection')
      .select('*')
      .eq('generatedId', generatedId)
      .eq('childid', userId)
      .single();

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!childRecord) {
      return NextResponse.json({ error: 'No record found to delete' }, { status: 404 });
    }

    // Delete the child record
    const { error: deleteChildError } = await supabase
      .from('child_collection')
      .delete()
      .eq('generatedId', generatedId)
      .eq('childid', userId);

    if (deleteChildError) {
      console.error('Delete child error:', deleteChildError);
      return NextResponse.json({ error: deleteChildError.message }, { status: 500 });
    }

    // Handle image deletion from storage
    if (!image_path) {
      console.error('Error: No image_path found');
      return NextResponse.json({ error: 'No image_path found' }, { status: 500 });
    }

    console.log(`Attempting to delete image at path: ${image_path}`);

    // Extract the file name and remove the query parameter
    const fileNameWithQuery = image_path.split('/').pop(); // Extracts "1737288930358-3e717481adee17e3c50fd838f7ce9edb.jpg?v=1737288930827"
    const fileName = fileNameWithQuery?.split('?')[0]; // Extracts "1737288930358-3e717481adee17e3c50fd838f7ce9edb.jpg"

    if (!fileName) {
      console.error('Error: Unable to extract file name from image_path');
      return NextResponse.json({ error: 'Invalid image_path' }, { status: 400 });
    }

    // Delete the image from the bucket
    const { error: deleteImageError } = await supabase.storage
      .from('Images_File')
      .remove([fileName]);

    if (deleteImageError) {
      console.error('Delete image from storage error:', deleteImageError);
      return NextResponse.json({ error: deleteImageError.message }, { status: 500 });
    }

    console.log(`Image "${fileName}" deleted from Images_File bucket.`);

    // Fetch all remaining child records for the user
    const { data: remainingChildRecords, error: fetchRemainingError } = await supabase
      .from('child_collection')
      .select('*')
      .eq('childid', userId);

    if (fetchRemainingError) {
      console.error('Fetch remaining child records error:', fetchRemainingError);
      return NextResponse.json({ error: fetchRemainingError.message }, { status: 500 });
    }

    // Check if there are any remaining child records
    const { count: updatedChildCount, error: updatedCountError } = await supabase
      .from('child_collection')
      .select('*', { count: 'exact', head: true })
      .eq('childid', userId);

    if (updatedCountError) {
      console.error('Updated count error:', updatedCountError);
      return NextResponse.json({ error: updatedCountError.message }, { status: 500 });
    }

    if (updatedChildCount === 0) {
      // Delete the image_collections record if no child records remain
      const { error: deleteImageCollectionError } = await supabase
        .from('image_collections')
        .delete()
        .eq('id', userId);

      if (deleteImageCollectionError) {
        console.error('Delete image from image_collections error:', deleteImageCollectionError);
        return NextResponse.json({ error: deleteImageCollectionError.message }, { status: 500 });
      }

      console.log(`Image with id ${userId} deleted from image_collections.`);
    } else {
      // Update the image_collections record with data from the first remaining child record
      const updatedData = {
        created_at: remainingChildRecords[0]?.created_at,
        title: remainingChildRecords[0]?.title,
        artist: remainingChildRecords[0]?.artist,
        year: remainingChildRecords[0]?.year,
        image_path: remainingChildRecords[0]?.path,
        desc: remainingChildRecords[0]?.desc,
      };

      const { error: updateImageCollectionError } = await supabase
        .from('image_collections')
        .update(updatedData)
        .eq('id', userId);

      if (updateImageCollectionError) {
        console.error('Update image collection error:', updateImageCollectionError);
        return NextResponse.json({ error: updateImageCollectionError.message }, { status: 500 });
      }

      console.log(`Updated image collection with new data from remaining child records:`, updatedData);
    }

    return NextResponse.json({ message: 'Record deleted successfully' }, { status: 200 });
  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}