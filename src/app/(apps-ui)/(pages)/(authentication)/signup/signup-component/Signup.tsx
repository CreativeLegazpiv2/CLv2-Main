"use client";

import React, { ChangeEvent, FormEvent, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from "@iconify/react/dist/iconify.js";
import { Logo } from "@/components/reusable-component/Logo";
import { signupUser } from "@/services/authservice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Step1 } from "./Step1";
import { Step2 } from './Step2';
import { Step3 } from './Step3';
import { Step4 } from './Step4';

interface UserDetail {
  username: string;
  email: string;
  password: string;
  name: string;
  creativeField: string;
  bday: string;
  address: string;
  bio: string;
  mobileNo: string;
  instagram: string;
  facebook: string;
  twitter: string;
  portfolioLink: string;
}

interface InputProps {
  name: keyof UserDetail;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
  icon: string;
  type?: string;
}
interface SelectProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder: string;
  icon: string;
  options: Array<{ value: string; label: string }>;
}


export const Signup = () => {
  return (
    <div className="w-full min-h-dvh lg:py-[20dvh] py-[15dvh] bg-[url('/images/signup/background.jpg')] bg-cover bg-no-repeat relative">
      <div className="absolute inset-0 w-full h-full bg-black/30"></div>
      <div className="relative w-full h-full xl:max-w-[55%] sm:max-w-[70%] max-w-[95%] mx-auto flex flex-col gap-10 justify-center items-center">
        <h1 className="font-bold lg:text-6xl md:text-5xl text-4xl text-white drop-shadow-xl lg:block hidden">
          BE ONE OF US
        </h1>
        <AccountCreation />
      </div>
    </div>
  );
};

const AccountCreation = () => {
  return (
    <div className="w-full h-full relative">
      <div className="w-full h-full flex bg-secondary-1 rounded-2xl z-50  relative">
        <div className="w-full h-full sm:p-10 lg:block hidden">
          <img
            className="w-fit h-full rounded-xl"
            src="../images/signup/study.png"
            alt=""
          />
        </div>
        <div className="w-full min-h-full lg:-ml-8 flex flex-col gap-4 justify-center items-center sm:p-10  md:p-4 p-6">
          <div className="w-64 h-fit"> 
            <Logo color="text-secondary-2" width={"auto"} height={"auto"} />
          </div>
          <div className="w-full h-full flex justify-end items-end  md:p-4 p-6">
            <MultiStepForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserDetail>({
    username: "",
    email: "",
    password: "",
    name: "",
    creativeField: "",
    bday:"",
    address: "",
    mobileNo: "",
    bio: "",
    instagram: "",
    facebook: "",
    twitter: "",
    portfolioLink: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent form submission on "Next" button click
    if (isStepValid()) {
      setStep((prev) => Math.min(prev + 1, 4));
      setError("");
    } else {
      setError("Please fill all required fields before proceeding.");
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    setError("");
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.username && formData.email && formData.password;
      case 2:
        return formData.name && formData.creativeField && formData.bday;
      case 3:
        return formData.address && formData.mobileNo && formData.bio;
      case 4:
        return true; // Social media links are optional
      default:
        return false;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    // Ensure this only happens on the final step (step 4)
    if (step !== 4) {
      e.preventDefault(); // Prevent submission if not on the last step
      return;
    }
  
    e.preventDefault(); // Prevent the default form submission
    try {
      await signupUser(
        formData.username,
        formData.email,
        formData.password,
        formData.name,
        formData.creativeField,
        formData.bday,
        formData.address,
        formData.mobileNo,
        formData.bio,
        formData.instagram,
        formData.facebook,
        formData.twitter,
        formData.portfolioLink
      );
      setSuccess("Signup successful!");
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    } catch (err) {
      setError((err as Error).message || "An error occurred during signup.");
    }
  };

  const handleCancel = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      name: "",
      creativeField: "",
      bday: "",
      address: "",
      mobileNo: "",
      bio: "",
      instagram: "",
      facebook: "",
      twitter: "",
      portfolioLink: "",
    });
    setStep(1);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <Step1 formData={formData} handleChange={handleChange} />;
      case 2:
        return <Step2 formData={formData} handleChange={handleChange} />;
      case 3:
        return <Step3 formData={formData} handleChange={handleChange} />;
      case 4:
        return <Step4 formData={formData} handleSubmit={handleSubmit} prevStep={prevStep} handleCancel={handleCancel} />;
      default:
        return null;
    }
  };

  return (
    <form className="w-full h-full flex flex-col gap-2 overflow-hidden" onSubmit={handleSubmit}>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>

      {error && <div className="text-red-500 mt-2">{error}</div>}
      {success && <div className="text-green-500 mt-2">{success}</div>}

      <div className="flex justify-center items-center gap-4 mt-4">
        {step > 1 && (
          <motion.button
            type="button"
            onClick={prevStep}
            className="border-2 border-secondary-2 text-secondary-2 w-full py-2"
            whileTap={{ scale: 0.95 }}
          >
            Previous
          </motion.button>
        )}
        {step < 4 ? (
          <motion.button
            type="button"
            onClick={nextStep}
            className="border-2 z-50 border-secondary-2 text-secondary-2 w-full py-2 ml-auto"
            whileTap={{ scale: 0.95 }}
          >
            Next
          </motion.button>
        ) : (
          <motion.button
            type="submit"
            className="w-full border-2 border-secondary-2 text-secondary-2 py-2 ml-auto"
            whileTap={{ scale: 0.95 }}
          >
            Submit
          </motion.button>
        )}
      </div>

      <div className="w-full flex flex-col justify-center items-center mt-2">
        <p>Already have an account?</p>
        <Link href="/signin" className="uppercase font-medium cursor-pointer">
          Login
        </Link>
      </div>
    </form>
  );
};


export const Input: React.FC<InputProps> = ({ name, value, onChange, placeholder, icon, type = "text" }) => (
  <div className="w-full relative">
    <input
      className="w-full h-10 border-b-2 p-4 pl-12 [&:-webkit-autofill]:transition-[background-color_5000s_ease-in-out_0s] bg-transparent placeholder:text-primary-2 font-normal border-secondary-2 outline-none ring-0"
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
    />
    <Icon
      className="text-secondary-2 absolute top-1/2 left-0 -translate-y-1/2"
      icon={icon}
      width="35"
      height="35"
    />
  </div>
);

export const TextArea: React.FC<InputProps> = ({ name, value, onChange, placeholder, icon }) => (
  <div className="w-full relative">
    <textarea
      className="w-full h-16 border-b-2 p-4 pl-12 bg-transparent [&:-webkit-autofill]:transition-[background-color_5000s_ease-in-out_0s] placeholder:text-primary-2 border-secondary-2 outline-none ring-0 resize-none"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
    />
    <Icon
      className="text-secondary-2 absolute top-4 left-0"
      icon={icon}
      width="35"
      height="35"
    />
  </div>
);


export const Select: React.FC<SelectProps> = ({ name, value, onChange, placeholder, icon, options }) => (
  <div className="relative w-full">
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-4 pl-12 pr-10 border-b-2 border-black outline-none [&:-webkit-autofill]:transition-[background-color_5000s_ease-in-out_0s] ring-0 appearance-none bg-transparent"
      required
    >
      <option value="" disabled>{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
    <Icon
      className="text-secondary-2 absolute top-1/2 left-0 -translate-y-1/2"
      icon={icon}
      width="35"
      height="35"
    />
    <Icon
      icon={"mdi:chevron-down"}
      className="absolute top-1/2 right-3 -translate-y-1/2 text-black pointer-events-none"
      width="20"
      height="20"
    />
  </div>
);

export default Signup;