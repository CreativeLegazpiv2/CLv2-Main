"use client";

import { Logo } from "@/components/reusable-component/Logo";
import { generateOtp, resetPassword, validateOtp } from "@/services/email/emailService";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ForgotPass = ({ handleBackToLogin }: { handleBackToLogin: () => void }) => {
  const [email, setEmail] = useState(""); // This is preserved for both OTP generation and validation
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [newPassword, setNewPassword] = useState(""); // New password state
  const [otpValid, setOtpValid] = useState(false); // State to track OTP validation status

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpRequest = async () => {
    setLoading(true);
    try {
      await generateOtp(email); // Generate OTP for the provided email
      toast.success("Check your email for OTP!", { position: "bottom-right" });
      setOtpSent(true); // OTP sent successfully
      setCountdown(180); // 3-minute countdown to resend OTP
    } catch (err: any) {
      console.error("OTP Error:", err);
      toast.error(err.message, { position: "bottom-right" });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!otp || !email) {
      toast.error("Email and OTP are required.", { position: "bottom-right" });
      return;
    }

    // Ensure OTP is exactly 6 digits
    if (otp.length !== 6) {
      toast.error("OTP must be exactly 6 digits.", { position: "bottom-right" });
      return;
    }

    setLoading(true);

    try {
      // Call validateOtp service to verify OTP
      const response = await validateOtp(email, otp);

      if (response.success) {
        toast.success("OTP is valid!", { position: "bottom-right" });
        setOtpValid(true); // Mark OTP as valid to show new password input
      } else {
        toast.error(response.message || "Invalid OTP.", { position: "bottom-right" });
      }
    } catch (err: any) {
      console.error("OTP Validation Error:", err);
      toast.error(err.message || "An error occurred while validating OTP.", { position: "bottom-right" });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!newPassword || !otp) {
      toast.error("New password and OTP are required.", { position: "bottom-right" });
      return;
    }

    setLoading(true);

    try {
      // Call resetPassword service to update password
      const response = await resetPassword(email, newPassword);

      if (response.success) {
        toast.success("Password updated successfully!", { position: "bottom-right" });

        // Redirect to login after a short delay
        setTimeout(() => {
          handleBackToLogin();
        }, 2000); // Adjust delay as needed
      } else {
        toast.error(response.message || "Failed to update password.", { position: "bottom-right" });
      }
    } catch (err: any) {
      console.error("Password Reset Error:", err);
      toast.error(err.message || "An error occurred while resetting the password.", { position: "bottom-right" });
    } finally {
      setLoading(false);
    }
  };



  return (
    <form className="w-full h-full flex flex-col gap-6">
      {/* Email Input */}
      {!otpSent && !otpValid && (
        <div className="w-full lg:max-w-sm relative">
          <input
            className="w-full border-2 pl-12 h-12 border-palette-2/50 outline-none bg-transparent placeholder-palette-1 rounded-full focus:border-palette-2 transition-colors"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Set email as the state
          />
          <Icon className="text-palette-1 absolute top-1/2 left-4 -translate-y-1/2" icon="mynaui:key" width="25" height="25" />
        </div>
      )}

      {/* OTP Input */}
      {otpSent && !otpValid && (
        <div className="w-full lg:max-w-sm relative">
          <input
            className="w-full border-2 pl-12 h-12 border-palette-2/50 outline-none bg-transparent placeholder-palette-1 rounded-full focus:border-palette-2 transition-colors"
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,6}$/.test(value)) setOtp(value); // Only allow numeric OTP
            }}
            maxLength={6}
          />
          <Icon className="text-palette-1 absolute top-1/2 left-4 -translate-y-1/2" icon="mynaui:key" width="25" height="25" />
        </div>
      )}

      {/* Submit/Resend Button */}
      {!otpValid && (
        <div className="w-full lg:max-w-sm relative">
          {otpSent ? (
            <motion.button
              className="absolute right-0 top-0 p-2 text-palette-2 text-sm flex items-center gap-2 underline hover:text-palette-1 transition-colors"
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOtpRequest}
              disabled={loading || countdown > 0}
            >
              Resend OTP 
              ({countdown > 0 ? `${countdown}s` : "Resend"})
            </motion.button>

          ) : (
            <motion.button
              className="w-full py-3 text-lg font-semibold uppercase bg-palette-2 text-white rounded-full hover:bg-palette-1 transition-colors"
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOtpRequest}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </motion.button>
          )}
        </div>
      )}


      {/* OTP Submit Button */}
      {!otpValid && otpSent && (
        <div className="w-full lg:max-w-sm mt-4">
          <motion.button
            className="w-full py-3 text-lg font-semibold uppercase bg-palette-3 text-white rounded-full hover:bg-palette-1 transition-colors"
            onClick={handleOtpSubmit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? "Validating OTP..." : "Submit OTP"}
          </motion.button>
        </div>
      )}

      {/* New Password Input (after OTP is validated) */}
      {otpValid && (
        <div className="w-full lg:max-w-sm relative mt-4">
          <input
            className="w-full border-2 pl-12 h-12 border-palette-2/50 outline-none bg-transparent placeholder-palette-1 rounded-full focus:border-palette-2 transition-colors"
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)} // Set new password as the state
          />
          <Icon className="text-palette-1 absolute top-1/2 left-4 -translate-y-1/2" icon="mynaui:key" width="25" height="25" />
        </div>
      )}

      {/* Submit New Password */}
      {otpValid && (
        <div className="w-full lg:max-w-sm mt-4">
          <motion.button
            className="w-full py-3 text-lg font-semibold uppercase bg-palette-4 text-white rounded-full hover:bg-palette-1 transition-colors"
            onClick={handlePasswordSubmit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? "Resetting password..." : "Submit New Password"}
          </motion.button>
        </div>
      )}

      {/* Back to Login */}
      <div className="w-full flex justify-center items-center">
        <button type="button" className="text-palette-1 underline mt-4" onClick={handleBackToLogin}>
          Back to Login
        </button>
      </div>

      <ToastContainer />
    </form>
  );
};
