import { NextResponse } from 'next/server'
import { supabase } from '@/services/supabaseClient'
import { details } from 'framer-motion/client'

export async function GET() {
    try {
        // Query usersLikes table
        const { data: usersLikes, error: usersLikesError } = await supabase
            .from('usersLikes')
            .select('*')

        if (usersLikesError) {
            console.error('usersLikesError:', usersLikesError)
            return NextResponse.json({ error: usersLikesError.message }, { status: 500 })
        }

        if (!usersLikes || usersLikes.length === 0) {
            return NextResponse.json({ message: 'No likes found' }, { status: 404 })
        }

        // Calculate total likes for each user
        const likesCount = usersLikes.map((like) => {
            const guestCount = like.guest ? Number(like.guest) : 0
            const usersCount = Array.isArray(like.users) ? like.users.length : 0
            const totalCount = guestCount + usersCount

            return {
                ...like,
                totalCount,
            }
        })

        // Find the user with the most likes
        const topLiked = likesCount.sort((a, b) => b.totalCount - a.totalCount)[0]

        if (!topLiked) {
            return NextResponse.json({ message: 'No top liked user found' }, { status: 404 })
        }

        // Fetch userDetails for the top liked user
        const { data: userDetails, error: userDetailsError } = await supabase
            .from('userDetails')
            .select('*')
            .eq('detailsid', topLiked.galleryLiked)  // Get only the top liked user's details
            .single()

        if (userDetailsError) {
            console.error('userDetailsError:', userDetailsError)
            return NextResponse.json({ error: userDetailsError.message }, { status: 500 })
        }

        if (!userDetails) {
            return NextResponse.json({ message: 'No matching user details found' }, { status: 404 })
        }

        // Combine userDetails with total likes count
        const combinedData = {
            first_name: userDetails.first_name,
            profile_pic: userDetails.profile_pic || "/images/creative-directory/profile.jpg",
            bio: userDetails.bio || "No bio available",
            creative_field: userDetails.creative_field || "Unknown Field",
            newCount: topLiked.totalCount || 0,
            detailsid: userDetails.detailsid,
            
        }

        return NextResponse.json(combinedData)
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json({ error: 'Invalid request format' }, { status: 400 })
    }
}
