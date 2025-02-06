"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState, useEffect } from "react";
import { FaqsArray } from "../faqs-component/FaqsArray";

interface FaqsArrayProps {
  id: number;
  question: string;
  answer: string;
}

export default function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<FaqsArrayProps[]>([]);

  useEffect(() => {
    const filtered = FaqsArray.filter(
      (item) =>
        item.question.toLowerCase().includes(query.toLowerCase()) ||
        item.answer.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  }, [query]);

  const handleNewSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/faqs/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="w-full min-h-screen bg-new-4 ">
      <div className="w-full h-fit pt-[12dvh] pb-[10dvh]">
        <div className="w-full md:max-w-screen-xl max-w-[90%] mx-auto min-h-[40dvh] bg-new-3 shadow-lg px-8 py-10 rounded-3xl">
          <div className="w-full h-full flex flex-col gap-8">
            {/* Header Section */}
            <div className="flex flex-col gap-6">
              <div className="w-full flex flex-col">
                <div className="w-full flex justify-between items-center">
                  <h1 className="font-extrabold text-4xl text-new-4 bg-gradient-to-r from-newtext-new-4 to-shade-1 bg-clip-text text-transparent">
                    Search Results
                  </h1>
                  <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-white hover:text-new-4 transition-all duration-300 w-fit group"
                  >
                    <Icon 
                      icon="eva:arrow-back-fill" 
                      width="24" 
                      height="24"
                      className="transform group-hover:-translate-x-1 transition-transform duration-300" 
                    />
                    <span className="font-medium">Back to Support</span>
                  </button>
                </div>
                <p className="text-xl text-white mt-2">
                  Found <span className="text-new-1 font-semibold">{results.length}</span> result{results.length !== 1 ? "s" : ""}{" "}
                  for "<span className="text-new-1 font-semibold">{query}</span>"
                </p>
              </div>

              {/* Search Input */}
              <div className="w-full xl:max-w-md lg:max-w-xs max-w-[90%] h-fit relative">
                <input
                  className="placeholder:text-shade-7 text-white text-lg font-medium rounded-full bg-new-5 ring-2 ring-transparent focus:ring-newtext-new-4 transition-all duration-300 outline-none w-full py-3 px-14"
                  type="text"
                  placeholder="Search again"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleNewSearch()}
                />
                <Icon
                  className="absolute top-1/2 -translate-y-1/2 left-4 text-shade-7"
                  icon="cil:search"
                  width="23"
                  height="23"
                />
                <button
                  onClick={handleNewSearch}
                  className="absolute top-1/2 -translate-y-1/2 right-4 text-shade-7 hover:text-new-4 transition-colors duration-300"
                >
                  <Icon
                    icon="iconamoon:send-thin"
                    width="28"
                    height="28"
                    className="transform hover:scale-110 transition-transform duration-300"
                  />
                </button>
              </div>
            </div>

            {/* Results Section */}
            <div className="w-full">
              {results.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                    <Icon 
                      icon="mingcute:search-line"
                      width="32"
                      height="32"
                      className="text-shade-7"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      No results found
                    </h3>
                    <p className="text-shade-7 text-sm">
                      Try different keywords or browse our FAQ sections
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4">
                  {results.map((item, index) => (
                    <div
                      key={index}
                      className="group p-6 bg-new-5 rounded-xl hover:border-new-4 transition-all duration-300 hover:shadow-md hover:scale-[1.02] cursor-pointer border-2 border-transparent hover:border-newtext-new-4"
                    >
                      <div>
                        <h3 className="font-semibold text-xl mb-3 text-stone-200 group-hover:text-new-4 transition-colors duration-300">
                          {item.question}
                        </h3>
                        <p className="text-stone-200 group-hover:text-bg-new-1 leading-relaxed transition-colors duration-300">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}