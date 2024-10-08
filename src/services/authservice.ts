// services/authService.ts
import { supabase } from '@/services/supabaseClient';
import bcrypt from 'bcryptjs';
import { createJWT, verifyJWT } from './jwt'; // Import createJWT and verifyJWT
import { NextResponse } from 'next/server';

export const loginUser = async (username: string, password: string) => {
  console.log("Attempting login with:", { username, password });

  const { data, error } = await supabase
    .from("users")
    .select("id, username, password")
    .eq("username", username)
    .single();

  if (error || !data) {
    console.log("Login failed: User not found");
    throw new Error("Invalid username or password");
  }

  const isPasswordMatch = await bcrypt.compare(password, data.password);
  if (!isPasswordMatch) {
    console.log("Login failed: Incorrect password");
    throw new Error("Invalid username or password");
  }

  // Create JWT upon successful login
  const token = await createJWT({ id: data.id, username: data.username });
  console.log("Login successful:", { id: data.id, username: data.username, token });

  // Decrypt and log the token payload
  try {
    const decryptedPayload = await verifyJWT(token); // Use the verifyJWT function to get the payload
    console.log('Decrypted Payload after Login:', decryptedPayload);
  } catch (error) {
    console.error('Failed to decrypt token:', error);
  }

  return { id: data.id, username: data.username, token };
};

export const decryptToken = async (token: string) => {
  if (!token) {
    throw new Error("No token provided");
  }

  try {
    // Use the correct secret for verification
    const payload = await verifyJWT(token);
    console.log('Decrypted Payload:', payload);
    return payload;
  } catch (error) {
    console.error('Error decrypting token:', error);
    throw new Error("Failed to decrypt token");
  }
};

export const signupUser = async (
  username: string,
  email: string,
  password: string,
  firstName: string,
  creativeField: string,
  address: string,
  mobileNo: string,
  bio: string,
  instagram: string,
  facebook: string,
  twitter: string,
  portfolioLink: string
) => {
  console.log("Attempting signup with:", { username, email });

  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert the new user into the 'users' table
  const { data: userData, error: userError } = await supabase
    .from("users")
    .insert([{ username, email, password: hashedPassword }])
    .select("id, username")
    .single();

  if (userError || !userData) {
    console.log("Signup failed:", userError ? userError.message : "Unknown error");
    throw new Error("Signup failed, please try again.");
  }

  console.log("User created in 'users' table:", { id: userData.id, username: userData.username });

  // Insert additional details into the 'userDetails' table
  const { error: detailsError } = await supabase
    .from("userDetails")
    .insert([{
      detailsid: userData.id, // Use the ID from the 'users' table as a foreign key
      first_name: firstName,
      creative_field: creativeField,
      address: address,
      mobileNo: mobileNo,
      bio: bio,
      instagram: instagram,
      facebook: facebook,
      twitter: twitter,
      portfolioLink: portfolioLink
    }]);

  if (detailsError) {
    console.log("Failed to insert user details:", detailsError.message);
    throw new Error("Signup failed, could not insert user details.");
  }

  console.log("User details added to 'userDetails' table");

  // Create a JWT for the new user
  const token = await createJWT({ id: userData.id, username: userData.username });
  console.log("JWT created for new user:", token);

  // Decrypt and log the token payload
  try {
    const decryptedPayload = await verifyJWT(token);
    console.log("Decrypted Payload after Signup:", decryptedPayload);
  } catch (error) {
    console.error("Failed to decrypt token:", error);
  }

  return { id: userData.id, username: userData.username, token };
};




export const getUserDetailsFromToken = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error("No token found in local storage");
    }

    const payload = await verifyJWT(token);
    const userId = payload.id;

    const { data, error } = await supabase
      .from('userDetails')
      .select('*')
      .eq('detailsid', userId)
      .single();

    if (error || !data) {
      throw new Error(error ? error.message : "Failed to fetch user details");
    }

    return data;
  } catch (error) {
    // Cast the error to 'Error' to safely access the 'message' property
    if (error instanceof Error) {
      console.error("Failed to retrieve user details:", error.message);
    } else {
      console.error("An unknown error occurred:", error);
    }

    throw new Error("Failed to retrieve user details");
  }
};





export const logoutUser = async () => {
  // Simulate an API call to log out the user
  return true;
};



