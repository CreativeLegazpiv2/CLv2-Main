// services/authService.ts
import { supabase } from '@/services/supabaseClient';
import bcrypt from 'bcryptjs';
import { createJWT, verifyJWT } from './jwt'; // Import createJWT and verifyJWT
import { NextResponse } from 'next/server';
export const loginUser = async (username: string, password: string) => {
  console.log("Attempting login with:", { username, password });

  // Step 1: Get user data from the 'users' table
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("id, username, password")
    .eq("username", username)
    .single();

  if (userError || !userData) {
    console.log("Login failed: User not found");
    throw new Error("Invalid username or password");
  }

  // Step 2: Check if the password matches
  const isPasswordMatch = await bcrypt.compare(password, userData.password);
  if (!isPasswordMatch) {
    console.log("Login failed: Incorrect password");
    throw new Error("Invalid username or password");
  }

  // Step 3: Check user status from 'userDetails' table
  const { data: userDetails, error: userDetailsError } = await supabase
    .from("userDetails")
    .select("status")
    .eq("detailsid", userData.id)
    .single();

  if (userDetailsError || !userDetails) {
    console.log("Login failed: Unable to fetch user details");
    throw new Error("User details not found");
  }

  // Step 4: Check if the user account is approved (status is true)
  if (!userDetails.status) {
    console.log("Login failed: Account not approved");
    throw new Error("Not authenticated, please wait to approve your account");
  }

  // Step 5: Create JWT upon successful login
  const token = await createJWT({ id: userData.id, username: userData.username });
  console.log("Login successful:", { id: userData.id, username: userData.username, token });

  // Decrypt and log the token payload
  try {
    const decryptedPayload = await verifyJWT(token); // Use the verifyJWT function to get the payload
  } catch (error) {
    console.error('Failed to decrypt token:', error);
  }

  return { id: userData.id, username: userData.username, token };
};


export const decryptToken = async (token: string) => {
  if (!token) {
    throw new Error("No token provided");
  }

  try {
    // Use the correct secret for verification
    const payload = await verifyJWT(token);
    return payload;
  } catch (error:any) {
    // If the token has expired, remove it from localStorage
    if (error.message === 'Token expired') {
      console.log('Token expired, removing from localStorage');
      localStorage.removeItem('token');
    }
    console.error('Error decrypting token:', error);
    throw new Error("Failed to decrypt token");
  }
};



const generateUniqueId = async (): Promise<number> => {
  let generatedId: number;
  let isUnique: boolean = false;

  do {
    generatedId = Math.floor(10000 + Math.random() * 90000); // Generate a random ID

    // Check if the generated ID already exists in the 'users' table
    const { data: existingUser, error } = await supabase
      .from("users")
      .select("id")
      .eq("id", generatedId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is the code for no rows found
      console.error("Error checking for existing user:", error.message);
      throw new Error("Failed to generate unique ID.");
    }

    if (!existingUser) {
      isUnique = true; // ID is unique
    }
  } while (!isUnique);

  return generatedId; // At this point, generatedId is guaranteed to be unique
};


export const signupBuyer = async (
  username: string,
  email: string,
  password: string,
  firstName: string,
  bday: string,
  address: string,
  mobileNo: string,
  bio: string,
  instagram: string,
  facebook: string,
  twitter: string,
  portfolioLink: string,
) => {
  console.log("Attempting signup with:", { username, email });

  // Check if the email already exists in the 'users' table
  const { data: existingUser, error: emailCheckError } = await supabase
    .from("users")
    .select("email")
    .eq("email", email)
    .single();

  if (existingUser) {
    console.log("Signup failed: Email already exists");
    throw new Error("Signup failed: Email already exists.");
  }

  if (emailCheckError && emailCheckError.code !== 'PGRST116') { // PGRST116 is the code for no rows found
    console.log("Error checking email existence:", emailCheckError.message);
    throw new Error("Signup failed, please try again.");
  }

  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);
  const generatedId = await generateUniqueId();

  // Insert the new user into the 'users' table
  const { data: userData, error: userError } = await supabase
    .from("users")
    .insert([{ id: generatedId, username, email, password: hashedPassword }])
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
      detailsid: userData.id,
      first_name: firstName,
      bday: bday,
      address: address,
      mobileNo: mobileNo,
      bio: bio,
      email: email,
      instagram: instagram,
      profile_pic: null,
      facebook: facebook,
      twitter: twitter,
      portfolioLink: portfolioLink,
      status: false,
      role: "buyer"
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
  } catch (error) {
    console.error("Failed to decrypt token:", error);
  }

  return { id: userData.id, username: userData.username, token };
};


export const signupUser = async (
  username: string,
  email: string,
  password: string,
  firstName: string,
  creativeField: string,
  bday: string,
  address: string,
  mobileNo: string,
  bio: string,
  instagram: string,
  facebook: string,
  twitter: string,
  portfolioLink: string,
) => {
  console.log("Attempting signup with:", { username, email });

  // Check if the email already exists in the 'users' table
  const { data: existingUser, error: emailCheckError } = await supabase
    .from("users")
    .select("email")
    .eq("email", email)
    .single();

  if (existingUser) {
    console.log("Signup failed: Email already exists");
    throw new Error("Failed to signup: Email already exists.");
  }

  if (emailCheckError && emailCheckError.code !== 'PGRST116') { // PGRST116 is the code for no rows found
    console.log("Error checking email existence:", emailCheckError.message);
    throw new Error("Signup failed, please try again.");
  }

  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);
  const generatedId = await generateUniqueId();

  // Insert the new user into the 'users' table
  const { data: userData, error: userError } = await supabase
    .from("users")
    .insert([{ id: generatedId, username, email, password: hashedPassword }])
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
      detailsid: userData.id,
      first_name: firstName,
      creative_field: creativeField,
      bday: bday,
      address: address,
      mobileNo: mobileNo,
      bio: bio,
      email: email,
      instagram: instagram,
      profile_pic: null,
      facebook: facebook,
      twitter: twitter,
      portfolioLink: portfolioLink,
      status: false
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

export const getSession = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("token");
  }
  return null;
};

export const getMessageId = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("messageId");
  }
  return null;
};

export const getRole = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("role");
  }
  return null;
};

export const getUserName = () => {
  if (typeof window !== "undefined") {
      return localStorage.getItem("user");
  }
  return null; // Return null or a default value if not in the browser
};

export const removeLocal = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("messageId");
    localStorage.removeItem("user");
    // localStorage.removeItem("messageTo");
  }
  return null; // Return null or a default value if not in the browser
};

export const logoutUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem("token");
    localStorage.removeItem("messageId");
    localStorage.removeItem("user");
    localStorage.removeItem("messageTo");
    localStorage.removeItem("Fname");
    localStorage.removeItem("role");
  }
};
export const getFname = () => {
  if (typeof window !== "undefined") {
      return localStorage.getItem("Fname");
  }
  return null; 
};


