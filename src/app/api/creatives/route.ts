import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabaseClient';

export async function PUT(req: Request) {
    console.log("PUT request received");

    const userId = req.headers.get('Authorization')?.split(' ')[1];
    if (!userId) {
        console.log("No Authorization header found");
        return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    try {
        console.log("UserId from Authorization:", userId);
        const formData = await req.formData();
        console.log("Request form data:", formData);

        const detailsid = formData.get('detailsid') as string;
        const userDetails = JSON.parse(formData.get('userDetails') as string);

        if (!userId) {
            console.log("Authorization mismatch");
            return NextResponse.json({ message: 'You are not authorized to update these details.' }, { status: 403 });
        }

        // Check if profile_pic is provided in the request
        const profilePicFile = formData.get('profile_pic') as File;
        if (profilePicFile) {
            // Fetch the current profile picture URL from the database
            const { data: currentUserDetails, error: fetchError } = await supabase
                .from('userDetails')
                .select('profile_pic')
                .eq('detailsid', userId)
                .single();

            if (fetchError) {
                console.error('Supabase fetch user details error:', fetchError);
                return NextResponse.json({ message: 'Failed to fetch user details', error: fetchError.message }, { status: 500 });
            }

            const currentProfilePicUrl = currentUserDetails?.profile_pic;

            // Delete the old profile picture from Supabase storage
            if (currentProfilePicUrl) {
                // Extract the file path from the public URL
                const urlParts = currentProfilePicUrl.split('/');
                const filePath = urlParts.slice(8).join('/'); // Extract from index 7 to the end

                console.log("File path to delete:", filePath);

                const { error: deleteError } = await supabase
                    .storage
                    .from('profile_image')
                    .remove([filePath]);
                if (deleteError) {
                    console.error('Supabase profile image delete error:', deleteError);
                    return NextResponse.json({ message: 'Failed to delete old profile image', error: deleteError.message }, { status: 500 });
                }

                console.log("Old profile picture deleted successfully");
            }

            // Upload the new profile picture to Supabase bucket
            const { data: uploadData, error: uploadError } = await supabase
                .storage
                .from('profile_image')
                .upload(`${userId}/${Date.now()}.jpg`, profilePicFile, {
                    contentType: 'image/jpeg',
                });

            if (uploadError) {
                console.error('Supabase profile image upload error:', uploadError);
                return NextResponse.json({ message: 'Failed to upload profile image', error: uploadError.message }, { status: 500 });
            }

            console.log("New profile picture uploaded successfully");

            // Get the public URL of the uploaded image
            const { data: { publicUrl } } = supabase
                .storage
                .from('profile_image')
                .getPublicUrl(uploadData.path);

            // Update the profile_pic with the public URL
            userDetails.profile_pic = publicUrl;
        }

        // Merge the userDetails object without profile picture URL
        const updatedUserDetails = { ...userDetails };
        console.log("Updated user details:", updatedUserDetails);

        // Update user details in Supabase
        const { data: updatedData, error: userDetailsError } = await supabase
            .from('userDetails')
            .update(updatedUserDetails)
            .eq('detailsid', userId)
            .select();

        if (userDetailsError) {
            console.error('Supabase userDetails update error:', userDetailsError);
            return NextResponse.json({ message: 'Failed to update user details', error: userDetailsError.message }, { status: 500 });
        }

        console.log("User details updated successfully:", updatedData);

        // Update related collections if first_name exists
        if (userDetails.first_name) {
            console.log("Updating related collections");

            const { error: childCollectionError } = await supabase
                .from('child_collection')
                .update({ artist: userDetails.first_name })
                .eq('childid', userId);

            if (childCollectionError) {
                console.error('Supabase child_collection update error:', childCollectionError);
            }

            const { error: imageCollectionError } = await supabase
                .from('image_collections')
                .update({ artist: userDetails.first_name })
                .eq('id', userId);

            const { error: messageError } = await supabase
                .from('messages')
                .update({ first_name: userDetails.first_name })
                .eq('id', userId);

            if (imageCollectionError) {
                console.error('Supabase image_collection update error:', imageCollectionError);
            }
            if (messageError) {
                console.error('Supabase message update error:', messageError);
            }
        }

        return NextResponse.json({ message: 'User details updated successfully', updatedData }, { status: 200 });

    } catch (error: any) {
        console.error('Error in PUT method:', error);
        return NextResponse.json({ message: 'Error processing the request', error: error.message }, { status: 500 });
    }
}