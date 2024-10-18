'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { jwtVerify } from 'jose';
import { getSession } from '@/services/authservice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret';

export default function PublishGallery() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [getFname, setFname] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    year: '',
    image: null as File | null,
  });
  const [loading, setLoading] = useState(false); // Add loading state

  const fname = localStorage.getItem("Fname");
  useEffect(() => {
    if (fname) {
     setFname(fname);
    }
  }, [fname]);


  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreview(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setImagePreview(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Prevent default behavior (Prevent file from being opened)
  };

  const setImagePreview = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    setFormData({ ...formData, image: file }); // Update form data with selected file
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpload = async () => {
    const token = getSession();
    const Fname = localStorage.getItem("Fname") as string;
    if (!token) return;

    setLoading(true); // Set loading to true when upload starts

    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
      const userIdFromToken = payload.id as string;

      const data = new FormData();
      data.append('image', formData.image as File);
      data.append('title', formData.title);
      data.append('desc', formData.desc);
      data.append('year', formData.year);

      const response = await fetch("/api/collections/publish", {
        method: "PUT",
        headers: {
          "user-id": userIdFromToken,
          "Fname": Fname
        },
        body: data,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to send message: ${errorBody}`);
      }

      const result = await response.json();
      console.log(result); // Handle success (optional)
      toast.success('Gallery published successfully!');
      setFormData({
        title: '',
        desc: '',
        year: '',
        image: null,
      });
      setPreviewImage(null);
      toast.success('Gallery published successfully!');
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error('Failed to publish gallery. Please try again.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="bg-gray-100 pt-36 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">PUBLISH</h2>
        <hr className="border-t border-gray-300 mb-8" />

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">UPLOAD</h3>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className="bg-orange-100 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-input"
                  />
                  <label htmlFor="file-input" className="cursor-pointer">
                    {previewImage ? (
                      <Image src={previewImage} alt="Preview" width={500} height={200} className="rounded-lg" />
                    ) : (
                      <>
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="mt-1">Drag and drop files here or click to upload</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                  <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>

                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
                  <input type="text" id="year" name="year" value={formData.year} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>

                <div>
                  <label htmlFor="desc" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea id="desc" name="desc" rows={3} value={formData.desc} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Publication preview</h3>
                {previewImage ? (
                  <div className="bg-white rounded-lg shadow-md overflow-hidden w-[300px] h-[400]">
                    <div className='overflow-hidden w-[300px] relative'>
                      <Image src={previewImage} alt="Preview" width={300} height={200} className="object-cover" />
                      <div className='absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-end p-2 bg-gradient-to-t from-black to-transparent'>
                        <h3 className="text-lg font-bold text-white">{formData.title || "Title"}</h3>
                        <p className="text-gray-200">by {fname}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="mt-2 text-gray-800 break-words">{formData.desc || "Description"}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Upload an image to see the preview.</p>
                )}
              </div>

              <motion.button
                onClick={handleUpload}
                disabled={loading} // Disable button during loading
                className={`w-full py-3 mt-4 rounded-md text-white ${loading ? 'bg-gray-500' : 'bg-orange-500 hover:bg-orange-600'}`}
              >
                {loading ? 'Publishing...' : 'Publish'} {/* Change button text based on loading state */}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
