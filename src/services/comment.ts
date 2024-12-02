import { NextResponse } from 'next/server';

export const submitComment = async (galleryId: string, userId: string, comment: string) => {
  try {
    const response = await fetch('/api/collections/comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x_galleryid': galleryId,  // Pass gallery ID
        'x_userid': userId,        // Pass user ID
        'x_comment': comment,      // Pass the comment
      },
      body: JSON.stringify({ comment }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit the comment');
    }

    const data = await response.json();
    return data;  // Return data for confirmation or handling
  } catch (error) {
    console.error("Error submitting comment:", error);
    throw error;
  }
};
