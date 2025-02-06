// import type { Metadata, ResolvingMetadata } from 'next';
// import { redirect } from 'next/navigation';
// import { supabase } from '@/services/supabaseClient';
// import CollectionDisplay from './CollectionDisplay';
// import { UserProfile } from './UserProfile';

// interface CollectionProps {
//   collection: {
//     images: {
//       created_at: Date;
//       generatedId: string;
//       image_path: string;
//       title: string;
//       desc: string;
//       artist: string;
//       year: number;
//       childid: string;
//     }[];
//   };
// }

// type Props = {
//   params: Promise<{ slug: string }>;
//   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
// };

// async function getCollection(slug: string): Promise<CollectionProps | null> {
//   const { data, error } = await supabase
//     .from('child_collection')
//     .select('*')
//     .eq('sluger', slug);

//   if (error) {
//     console.error('Error fetching collection:', error);
//     return null;
//   }

//   if (!data || data.length === 0) {
//     return null;
//   }

//   const images = data.map(item => ({
//     created_at: new Date(item.created_at),
//     generatedId: item.generatedId,
//     image_path: item.path,
//     title: item.title,
//     desc: item.desc,
//     artist: item.artist,
//     year: Number(item.year),
//     childid: item.childid,
//   }));

//   return {
//     collection: { images },
//   };
// }

// export async function generateMetadata(
//   { params }: Props,
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   const slug = (await params).slug;
//   const collectionData = await getCollection(slug);

//   if (!collectionData) {
//     return {
//       title: 'Collection Not Found',
//       description: 'The requested collection could not be found.',
//     };
//   }

//   return {
//     title: `Collections: ${collectionData.collection.images[0].artist}`,
//     description: `View details of the collection: ${slug}`,
//   };
// }

// export default async function ViewCollectionPage({ params }: Props) {
//   const slug = (await params).slug;
//   const collectionData = await getCollection(slug);

//   if (!collectionData) {
//     redirect('/gallery-display');
//     return null; 
//   }

//   return (
//     <div className="h-fit w-full py-[15dvh] mx-auto">
//       <CollectionDisplay collection={collectionData.collection} />
//       <UserProfile />
//     </div>
//   );
// }


"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import ProfileDetailsSkeleton from "@/components/Skeletal/profileSkeleton";
import { UserProfile } from "./UserProfile";
import CollectionDisplay from "./CollectionDisplay";
import { supabase } from "@/services/supabaseClient";

interface UserDetail {
  detailsid: string;
  first_name: string;
  creative_field: string;
  address: string;
  mobileNo: string;
  bio?: string;
  instagram: string;
  facebook: string;
  twitter: string;
  portfolioLink: string;
  profile_pic?: string;
  role: string;
}

interface CollectionItem {
  created_at: Date;
  generatedId: string;
  path: string;
  title: string;
  desc: string;
  artist: string;
  year: number;
  childid: string;
}

interface ApiResponse {
  userDetails: UserDetail;
  collection: CollectionItem[];
}

interface CollectionProps {
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
}

export default function CollectionPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [collectionData, setCollectionData] = useState<CollectionProps | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const slug = pathname.split("/").pop(); // Extract slug from URL
        if (!slug) {
          throw new Error("Invalid slug");
        }

        setLoading(true); // Start loading

        // Fetch user profile data
        const response = await fetch(`/api/profile/${slug}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const result: ApiResponse = await response.json();
        setData(result);

        // Fetch collection data
        const { data: collectionResult, error } = await supabase
          .from('child_collection')
          .select('*')
          .eq('sluger', slug);

        if (error || !collectionResult || collectionResult.length === 0) {
          throw new Error("Failed to fetch collection data");
        }

        const images = collectionResult.map(item => ({
          created_at: new Date(item.created_at),
          generatedId: item.generatedId,
          image_path: item.path,
          title: item.title,
          desc: item.desc,
          artist: item.artist,
          year: Number(item.year),
          childid: item.childid,
        }));

        setCollectionData({ images });

      } catch (error: any) {
        console.error(error);
        alert(`Error fetching data: ${error.message}. Redirecting to home.`);
        router.push("/");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, [pathname, router]);

  if (loading) {
    return <ProfileDetailsSkeleton />;
  }

  if (!data) {
    return <div>User not found</div>;
  }

  if (!collectionData) {
    router.push('/gallery-display');
    return null;
  }

  return (
    <div className="min-h-dvh w-full bg-palette-5">
      {/* Render UserProfile with user details */}
      <UserProfile
        initialUserDetail={data.userDetails}
        collection={data.collection}
      />

      {/* Display the user's collection */}
      <CollectionDisplay collection={collectionData} />
    </div>
  );
}
