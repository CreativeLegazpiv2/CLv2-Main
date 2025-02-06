export const generateOtp = async (email: string) => {
  try {
    const response = await fetch("/api/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const responseBody = await response.json(); // Parse response

    if (!response.ok) {
      console.error("Error response:", responseBody);
      throw new Error(responseBody.error || "Failed to generate OTP");
    }

    return responseBody; // Return success response
  } catch (error: any) {
    console.error("Error generating OTP:", error);
    throw new Error(error.message || "An error occurred while generating OTP");
  }
};


// services/otpService.ts

// services/otpService.ts

export const validateOtp = async (email: string, otp: string) => {
  try {
    const response = await fetch("/api/email/verifyOTP", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error validating OTP");
    }

    return data; // Return the success data
  } catch (error: any) {
    console.error("OTP Validation Error:", error);
    throw new Error(error.message || "Error submitting OTP. Please try again.");
  }
};



// services/password/passwordService.ts
// services/password/passwordService.ts
export const resetPassword = async (email: string, newPassword: string) => {
  try {
    const response = await fetch('/api/email/password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        newPassword
      }),
    });

    const result = await response.json();

    if (response.ok) {
      return { success: true, message: result.message };
    } else {
      return { success: false, message: result.message || 'Something went wrong' };
    }
  } catch (error) {
    console.error('Password Reset Service Error:', error);
    throw new Error('An error occurred while resetting the password');
  }
};

