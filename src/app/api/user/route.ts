import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabaseClient';

export async function GET(req: Request) {
    try {
        // Extract the token (user ID) from the headers
        const userId = req.headers.get('Authorization');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 401 });
        }

        // Query the userDetails table to get the first_name
        const { data, error } = await supabase
            .from('userDetails')
            .select('first_name')
            .eq('detailsid', userId) // Assuming the column name is `user_id`
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!data) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Return the first_name
        return NextResponse.json({ first_name: data.first_name }, { status: 200 });

    } catch (err) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}