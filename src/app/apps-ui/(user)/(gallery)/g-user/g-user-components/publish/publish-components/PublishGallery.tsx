"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function PublishGallery() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex w-full justify-between items-center">
        <h1 className="text-2xl font-bold mb-6">PUBLISH</h1>
        <Icon
          onClick={() => window.history.back()}
          className="cursor-pointer"
          icon="ion:arrow-back"
          width="35"
          height="35"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div>
          <h2 className="text-lg font-semibold mb-4">UPLOAD</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4">
            <div className="bg-orange-100 rounded-lg p-8 text-center">
              <Icon
                className="mx-auto h-12 w-12 text-gray-400"
                icon="stash:image-plus-light"
                width="25"
                height="25"
              />
              <p className="mt-1">Drag and drop files here</p>
              <button className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition duration-300">
                BROWSE
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option>Select creative domain</option>
                {/* Add more options here */}
              </select>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Publication preview</h3>
            {previewImage ? (
              <Image
                src={previewImage}
                alt="Preview"
                width={300}
                height={200}
                className="rounded-lg"
              />
            ) : (
              <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center text-gray-400">
                No image selected
              </div>
            )}
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Add to collections</h3>
            <button className="flex items-center text-sm text-gray-600 hover:text-gray-800">
              <svg
                width="auto"
                height="auto"
                className="h-5 w-5 mr-1"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 4v16m8-8H4"></path>
              </svg>
              Create new collection
            </button>
          </div>

          <div className="space-y-2">
            <button className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              FEATURED WORKS
            </button>
            <button className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              POPULAR
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          CANCEL
        </button>
        <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
          SAVE
        </button>
      </div>
    </div>
  );
}
