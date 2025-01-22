// import { NextResponse } from 'next/server';
// import { supabase } from '@/services/supabaseClient';

// export async function PUT(req: Request, { params }: { params: { generatedId: string } }) {
//   try {
//     const { userId, updatedData } = await req.json();
//     const { generatedId } = params;

//     if (!generatedId || !userId) {
//       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     // Perform the update in the Supabase table
//     const { error: updateError } = await supabase
//       .from('image_collections')
//       .update(updatedData)
//       .eq('id', generatedId)
//       .eq('id', userId);

//     if (updateError) {
//       console.error('Update error:', updateError);
//       return NextResponse.json({ error: updateError.message }, { status: 500 });
//     }

//     return NextResponse.json({ message: 'Collection updated successfully' }, { status: 200 });
//   } catch (err) {
//     console.error('Server error:', err);
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }
