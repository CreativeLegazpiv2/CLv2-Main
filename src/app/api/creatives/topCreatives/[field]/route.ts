import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabaseClient';

export async function GET(req: Request) {
    try {
        // Extract the 'field' parameter from the URL path using the request URL
        const url = new URL(req.url);
        const field = url.pathname.split('/')[4];

        if (!field) {
            return NextResponse.json({ error: 'Field parameter is required in the URL path' }, { status: 400 });
        }

        // Query usersLikes table
        const { data: usersLikes, error: usersLikesError } = await supabase
            .from('usersLikes')
            .select('*');

        if (usersLikesError) {
            console.error('usersLikesError:', usersLikesError);  // Log the error
            return NextResponse.json({ error: usersLikesError.message }, { status: 500 });
        }

        if (usersLikes.length === 0) {
            return NextResponse.json({ message: 'No matching records found in usersLikes' }, { status: 404 });
        }

        // Calculate total likes for each user
        const likesCount = usersLikes.map((like) => {
            const guestCount = like.guest ? Number(like.guest) : 0;
            const usersCount = Array.isArray(like.users) ? like.users.length : 0;
            const totalCount = guestCount + usersCount;

            return {
                ...like,
                totalCount,
            };
        });

        // Sort by totalCount in descending order and take top 10
        const topLikes = likesCount.sort((a, b) => b.totalCount - a.totalCount).slice(0, 10);

        // Fetch userDetails for top likes
        const topGalleryLikedIds = topLikes.map((like) => like.galleryLiked);
        const { data: userDetails, error: userDetailsError } = await supabase
            .from('userDetails')
            .select('*')
            .in('detailsid', topGalleryLikedIds)
            .eq('creative_field', field);  // Use the extracted 'field'

        if (userDetailsError) {
            console.error('userDetailsError:', userDetailsError);  // Log the error
            return NextResponse.json({ error: userDetailsError.message }, { status: 500 });
        }

        if (userDetails.length === 0) {
            return NextResponse.json({ message: 'No matching records found in userDetails' }, { status: 404 });
        }

        // Combine userDetails with likesCount
        const combinedData = userDetails.map((detail) => {
            const likes = likesCount.find((like) => like.galleryLiked === detail.detailsid);
            return {
                first_name: detail.first_name,
                profile_pic: detail.profile_pic || "/images/creative-directory/boy.png",
                bio: detail.bio || "No bio available",
                newCount: likes?.totalCount || 0,
            };
        });

        return NextResponse.json(combinedData);
    } catch (error) {
        console.error('Unexpected error:', error);  // Log unexpected errors
        return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
    }
}
