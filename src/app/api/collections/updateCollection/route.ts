import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabaseClient';

export async function PUT(req: Request) {
  try {
    const token = req.headers.get('userId');
    if (!token) {
      return NextResponse.json({ error: 'Missing authorization token' }, { status: 401 });
    }

    // Parse the incoming form data
    const formData = await req.formData();
    const imageBefore = formData.get('imageBefore'); // The URL of the previous image
    const updatedData = {
      title: formData.get('title'),
      desc: formData.get('desc'),
      year: formData.get('year'),
      artist: formData.get('artist'),
      image: formData.get('image'), // Assuming this is a File
      created_at: formData.get('created_at'), // Include created_at for the update condition
      generatedId: formData.get('generatedId')
    };

    if (!updatedData.title || !updatedData.year || !updatedData.desc) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!(updatedData.image instanceof Blob)) {
      return NextResponse.json({ error: 'Invalid image file.' }, { status: 400 });
    }

    // Generate a unique file name for the new image
    const uniqueFileName = `${Date.now()}-${updatedData.image.name}`;

    // Upload the new image to Supabase Storage
    const { error: uploadError } = await supabase
      .storage
      .from('Images_File')
      .upload(uniqueFileName, updatedData.image, {
        upsert: false, // Do not overwrite existing files
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Get the public URL of the uploaded image
    const { data: publicUrlData } = supabase
      .storage
      .from('Images_File')
      .getPublicUrl(uniqueFileName);

    const publicUrl = publicUrlData.publicUrl;

    // Fetch the oldest record in the child_collection for the user
    const { data: oldestChildData, error: oldestChildError } = await supabase
      .from('child_collection')
      .select('*') // Select all fields to get the full record
      .eq('childid', token) // Ensure the record belongs to the user
      .order('created_at', { ascending: true })
      .limit(1);

    if (oldestChildError || !oldestChildData.length) {
      return NextResponse.json({ error: 'Error fetching the oldest child collection record' }, { status: 500 });
    }

    const oldestRecord = oldestChildData[0];
    const oldestCreatedAt = oldestRecord.created_at;

    // Extract the date and time up to the seconds (ignore milliseconds and timezone)
    const updatedCreatedAt = updatedData.created_at as string;
    const updatedCreatedAtTrimmed = updatedCreatedAt.slice(0, 19); // Extract up to seconds
    const oldestCreatedAtTrimmed = oldestCreatedAt.slice(0, 19); // Extract up to seconds

    console.log('Updated Created At (Trimmed):', updatedCreatedAtTrimmed);
    console.log('Oldest Created At (Trimmed):', oldestCreatedAtTrimmed);

    // Update the child_collection record
    const { data: childData, error: childError } = await supabase
      .from('child_collection')
      .update({
        path: publicUrl, // Use the public URL of the new image
        year: updatedData.year,
        title: updatedData.title,
        artist: updatedData.artist,
        desc: updatedData.desc,
      })
      .eq('childid', token)
      .eq('generatedId', updatedData.generatedId);

    if (childError) {
      return NextResponse.json({ error: childError.message }, { status: 500 });
    }

    // Update image_collections if this is the oldest record (ignoring milliseconds and timezone)
    if (updatedCreatedAtTrimmed === oldestCreatedAtTrimmed) {
      console.log('Updating image_collections...');
      const { data: imageData, error: imageError } = await supabase
        .from('image_collections')
        .update({
          image_path: publicUrl,
          year: updatedData.year,
          title: updatedData.title,
          artist: updatedData.artist,
          desc: updatedData.desc,
        })
        .eq('id', token); // Use the token to match the image_collections record

      if (imageError) {
        console.error('Error updating image_collections:', imageError);
        return NextResponse.json({ error: imageError.message }, { status: 500 });
      } else {
        console.log('image_collections updated successfully:', imageData);
      }
    } else {
      console.log('Skipping image_collections update: Not the oldest record or created_at mismatch.');
    }

    // Remove the old image from Supabase storage
    if (typeof imageBefore === 'string') {
      console.log('Old image URL:', imageBefore); // Debugging: Log the old image URL

      // Extract the file name from the URL
      const urlParts = imageBefore.split('/');
      const fileName = urlParts[urlParts.length - 1]; // Extracts "1735902444641-Example.jpg"

      console.log('File name to delete:', fileName); // Debugging: Log the file name

      // Delete the old image
      const { error: deleteError } = await supabase
        .storage
        .from('Images_File') // Hardcoded bucket name
        .remove([fileName]);

      if (deleteError) {
        console.error('Error deleting old image:', deleteError); // Debugging: Log the error
        return NextResponse.json({ error: `Failed to delete previous image: ${deleteError.message}` }, { status: 500 });
      } else {
        console.log('Old image deleted successfully'); // Debugging: Log success
      }
    }

    // Return success response
    return NextResponse.json({
      message: 'Collection and image updated successfully',
      updatedChildCollection: childData,
    });

  } catch (error) {
    console.error('Error in API:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}