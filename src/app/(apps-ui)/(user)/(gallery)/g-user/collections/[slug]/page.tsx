import { notFound, redirect } from 'next/navigation'; // Import redirect
import { supabase } from '@/services/supabaseClient'; // Adjust the import path as needed
import CollectionDisplay from './CollectionDisplay'; // Adjust the import path to your component
import { Icon } from '@iconify/react/dist/iconify.js';

// Define the CollectionProps interface
interface CollectionProps {
  collection: {
    images: {
      created_at: Date;
      generatedId: string;
      image_path: string;
      title: string;
      desc: string;
      artist: string;
      year: number;
      childid: string;
    }[];
  };
}

async function getCollection(slug: string): Promise<CollectionProps | null> {
  const { data, error } = await supabase
    .from('child_collection')
    .select('*')
    .eq('sluger', slug);

  if (error) {
    console.error('Error fetching collection:', error);
    return null;
  }

  // If data is empty, return null
  if (!data || data.length === 0) {
    return null;
  }

  const collection = data[0];

  // Map the images correctly according to the CollectionProps interface
  const images = data.map(item => ({
    created_at: new Date(item.created_at), // Convert to Date
    generatedId: item.generatedId,
    image_path: item.path, // Assuming 'path' is the correct field for the image URL
    title: item.title,
    desc: item.desc,
    artist: item.artist,
    year: Number(item.year), // Convert to number
    childid: item.childid
  }));

  return {
    collection: { images }, // Return the collection object as expected in CollectionProps
  };
}

export default async function ViewCollectionPage({ params }: { params: { slug: string } }) {
  const collectionData = await getCollection(params.slug);

  // If collectionData is null (empty data), redirect to /apps-ui/g-user
  if (!collectionData) {
    redirect('/apps-ui/g-user');
  }

  return (
    <div className='h-fit w-full py-[15dvh] mx-auto'>
      <CollectionDisplay collection={collectionData.collection} />
    </div>
  );
}