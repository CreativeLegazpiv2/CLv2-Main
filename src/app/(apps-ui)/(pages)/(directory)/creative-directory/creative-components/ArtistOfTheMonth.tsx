'use client'

import { ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"

interface UserCardProps {
  first_name: string
  profile_pic: string
  bio: string
  detailsid: string
  creative_field: string
  newCount: number


}

export const ArtistOfTheMonth = () => {
  const [topCreative, setTopCreative] = useState<UserCardProps | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTopCreative = async () => {
      try {
        const response = await fetch(`/api/creatives/artistOfTheMonth`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch data")
        }

        const data = await response.json()
        setTopCreative(data)
        setLoading(false)
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchTopCreative()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="w-full lg:h-dvh h-fit bg-palette-2 text-white">
      <div className="w-full h-full md:max-w-[80%] max-w-[90%] mx-auto flex lg:flex-row flex-col lg:py-0 py-[10dvh] lg:gap-[10dvh] gap-12">
        <div className="w-full lg:h-full h-fit flex md:justify-start justify-center items-center">
          <div className="h-fit lg:w-fit w-full flex flex-col gap-3">
            <h1 className="title text-4xl font-normal">ARTIST OF THE MONTH</h1>

            {topCreative && (
              <div className="h-fit w-full flex flex-col gap-3">
                <span className="w-full max-w-lg text-5xl font-bold">
                  {topCreative.first_name}
                </span>
                <span className="text-3xl italic font-bold">{topCreative.creative_field}</span>
                <p className={`text-semibold max-w-md ${topCreative.bio.length > 100 ? "line-clamp-5" : ""}`}>
                  {topCreative.bio}
                </p>

                <div className="pt-6 relative h-fit w-full">
                  <button type="button" onClick={() => window.location.href = `/gallery-display/collections/${topCreative.detailsid}`} className="w-full max-w-60 py-3 text-xl z-20 bg-palette-6 uppercase text-palette-5 rounded-full font-semibold tracking-wider relative">
                    See Works
                    <span className="absolute right-4 top-1/2 -translate-y-1/2">
                      <ChevronRight />
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-full h-full flex lg:justify-end justify-center items-center">
          <div className="w-full h-full bg-gray-500 rounded-[2rem] min-h-[50dvh] max-h-[70dvh] md:max-w-md overflow-hidden">
            {topCreative && (
              <img
                src={topCreative.profile_pic}
                alt={`${topCreative.first_name}'s profile`}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
