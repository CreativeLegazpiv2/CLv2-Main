// import { supabase } from '@/services/supabaseClient';

// export const GET = async (req: Request, { params }: { params: { id: string } }) => {
//     const { id } = params;

//     if (!id) {
//         return new Response(JSON.stringify({ error: "User ID is required" }), {
//             status: 400,
//         });
//     }

//     // Fetch user details from the 'userDetails' table
//     const { data, error } = await supabase
//         .from('userDetails')
//         .select('*')
//         .eq('detailsid', id)
//         .single();

//     if (error) {
//         return new Response(JSON.stringify({ error: error.message }), {
//             status: 400,
//         });
//     }

//     if (!data) {
//         return new Response(JSON.stringify({ error: "User not found" }), {
//             status: 404,
//         });
//     }

//     return new Response(JSON.stringify(data), {
//         status: 200,
//     });
// };


import { supabase } from '@/services/supabaseClient';

export const GET = async (req: Request, context: { params: Promise<{ id: string }> }) => {
    try {
        // Await the `params` Promise to resolve it into an object
        const params = await context.params;

        // Destructure `id` from the resolved object
        const { id } = params;

        if (!id) {
            return new Response(JSON.stringify({ error: "User ID is required" }), {
                status: 400,
            });
        }

        // Step 1: Fetch user details from the 'userDetails' table
        const { data: userDetails, error: userDetailsError } = await supabase
            .from('userDetails')
            .select('*')
            .eq('detailsid', id)
            .single();

        if (userDetailsError) {
            return new Response(JSON.stringify({ error: userDetailsError.message }), {
                status: 400,
            });
        }

        if (!userDetails) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
            });
        }

        // Step 2: Fetch collection data from the 'child_collection' table
        const { data: childCollectionData, error: childCollectionError } = await supabase
            .from('child_collection')
            .select('*')
            .eq('sluger', id) // Match slugger with the id parameter
            .order('created_at', { ascending: false }); // Sort by created_at (latest first)

        if (childCollectionError) {
            return new Response(JSON.stringify({ error: childCollectionError.message }), {
                status: 400,
            });
        }

        // Transform the child collection data into the desired format
        const collection = childCollectionData.map((item) => ({
            created_at: new Date(item.created_at),
            generatedId: item.generatedId,
            path: item.path,
            title: item.title,
            desc: item.desc,
            artist: item.artist,
            year: Number(item.year),
            childid: item.childid,
        }));

        // Combine the results into a single response
        return new Response(
            JSON.stringify({
                userDetails,
                collection,
            }),
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error("Error fetching data:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
        });
    }
};