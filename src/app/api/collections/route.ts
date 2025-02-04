// api/collections
import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabaseClient';

export async function GET(req: Request) {
  const headers = req.headers;
  const slug = headers.get("Slug");

  try {
    // Fetch all records from the 'image_collections' table in descending order
    const { data: fetchCollection, error: fetchError } = await supabase
      .from('image_collections')
      .select('*') // Selects all columns
      .order('created_at', { ascending: false }); // Sort by `created_at` in descending order

    if (fetchError) {
      console.error('Error fetching image collection:', fetchError);
      return NextResponse.json(
        { message: 'Failed to fetch image collection', error: fetchError.message },
        { status: 500 }
      );
    }

    // Extract the IDs from the fetched image collections
    const imageCollectionIds = fetchCollection.map((item) => item.id);

    // Fetch user details where `detailsid` matches the `id` from `image_collections`
    const { data: userDetails, error: userError } = await supabase
      .from('userDetails')
      .select('profile_pic, creative_field, detailsid') // Select only the required fields
      .in('detailsid', imageCollectionIds); // Match `detailsid` with the `id` values

    if (userError) {
      console.error('Error fetching user details:', userError);
      return NextResponse.json(
        { message: 'Failed to fetch user details', error: userError.message },
        { status: 500 }
      );
    }

    // Combine the user details with the corresponding image collection data
    const enrichedCollections = fetchCollection.map((collection) => {
      const matchingUser = userDetails.find((user) => user.detailsid === collection.id);
      return {
        ...collection,
        profile_pic: matchingUser?.profile_pic || null,
        creative_field: matchingUser?.creative_field || null,
      };
    });

    // Fetch all records from the 'child_collection' table
    const { data: fetchChildCollection, error: fetchChildError } = await supabase
      .from('child_collection')
      .select('*')
      .eq('sluger', slug);

    if (fetchChildError) {
      console.error('Error fetching child collection:', fetchChildError);
      return NextResponse.json(
        { message: 'Failed to fetch child collection', error: fetchChildError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        imageCollection: enrichedCollections, // Enriched with user details
        childCollection: fetchChildCollection,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET method:', error);
    return NextResponse.json(
      { message: 'Signature verification failed or error processing the request' },
      { status: 500 }
    );
  }
}