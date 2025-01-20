// services/jwt.ts
import { SignJWT, jwtVerify, JWTPayload } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret'; // Use a strong secret

// Define a specific payload interface
interface TokenPayload extends JWTPayload {
  id: string; // Assuming id is a string, change type if necessary
  username: string;
}

export const createJWT = async (payload: TokenPayload) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' }) // Set the signing algorithm
    .setIssuedAt() // Set the issued time
    // Remove .setExpirationTime() to make the JWT non-expiring
    .sign(new TextEncoder().encode(JWT_SECRET));
};

export const verifyJWT = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return payload; // Returns the payload if verification is successful
  } catch (error: any) {
    if (error.code === 'ERR_JWT_EXPIRED') {
      console.error('Token expired:', error);
      throw new Error('Token expired'); // Throw a specific error for expiration
    }
    console.error('Token verification failed:', error);
    throw new Error('Token verification failed');
  }
};

export const checkTokenExpiration = async (token: string): Promise<boolean> => {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    const expirationTime = payload.exp as number;

    // If there's no expiration time, the token is non-expiring
    if (!expirationTime) {
      return false; // Token is valid (non-expiring)
    }

    const currentTime = Math.floor(Date.now() / 1000);

    if (currentTime > expirationTime) {
      // Token is expired
      return true;
    }

    // Token is valid
    return false;
  } catch (error) {
    console.error('Error verifying token:', error);
    return true; // Assume token is invalid if there's an error
  }
};

export const logoutAndRedirect = () => {
  localStorage.removeItem('token'); // Remove the token from local storage
  localStorage.removeItem('Fname'); // Optionally remove other user-related data
  window.location.href = '/signin'; // Redirect to the sign-in page
};