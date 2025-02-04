import type { Metadata, ResolvingMetadata } from 'next';
import { redirect } from 'next/navigation';
import { supabase } from '@/services/supabaseClient';
import CollectionDisplay from './CollectionDisplay';

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

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function getCollection(slug: string): Promise<CollectionProps | null> {
  const { data, error } = await supabase
    .from('child_collection')
    .select('*')
    .eq('sluger', slug);

  if (error) {
    console.error('Error fetching collection:', error);
    return null;
  }

  if (!data || data.length === 0) {
    return null;
  }

  const images = data.map(item => ({
    created_at: new Date(item.created_at),
    generatedId: item.generatedId,
    image_path: item.path,
    title: item.title,
    desc: item.desc,
    artist: item.artist,
    year: Number(item.year),
    childid: item.childid,
  }));

  return {
    collection: { images },
  };
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug;
  const collectionData = await getCollection(slug);

  if (!collectionData) {
    return {
      title: 'Collection Not Found',
      description: 'The requested collection could not be found.',
    };
  }

  return {
    title: `Collections: ${collectionData.collection.images[0].artist}`,
    description: `View details of the collection: ${slug}`,
  };
}

export default async function ViewCollectionPage({ params }: Props) {
  const slug = (await params).slug;
  const collectionData = await getCollection(slug);

  if (!collectionData) {
    redirect('/gallery-display');
    return null; // This prevents further rendering after redirection.
  }

  return (
    <div className="h-fit w-full py-[15dvh] mx-auto">
      <CollectionDisplay collection={collectionData.collection} />
    </div>
  );
}
