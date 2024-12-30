import { motion } from "framer-motion";
import { useState } from "react";
import { Logo } from "./Logo";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast CSS

interface InputFieldProps {
  icon: any;
  placeholder: string;
  type?: string;
  name: string;
  value: string;
  error?: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  icon,
  placeholder,
  type = "text",
  name,
  value,
  onChange,
  error,
  required = true,
}) => {
  const isContactField = name === "contact";

  return (
    <div className="relative w-full group">
      <div className="flex items-center">
        {isContactField && (
          <span className={`mr-1 text-gray-700 absolute ${isContactField ? "px-8" : ""}`}>+63</span>
        )}
        <input
          className={`w-full h-12 bg-transparent border-b-2 border-secondary-2/30 ${isContactField ? "pl-20" : "px-8"}
                 text-primary-2 placeholder:text-primary-2/50 outline-none transition-all duration-300
                 focus:border-secondary-2 [&:-webkit-autofill]:transition-[background-color_5000s_ease-in-out_0s]`}
          type={type}
          name={name}
          placeholder={placeholder}
          autoComplete="off"
          required={required}
          value={value}
          onChange={(e) => {
            if (isContactField) {
              const inputValue = e.target.value;
              if (!/^9\d{9}$/.test(inputValue)) {
                e.target.setCustomValidity(
                  "Contact number must start with 9 and be exactly 10 digits long."
                );
              } else {
                e.target.setCustomValidity("");
              }
            }
            onChange(e);
          }}
        />
        <Icon
          icon={icon}
          className="absolute left-0 top-1/2 -translate-y-1/2 text-primary-2/50 w-6 h-6
                 group-focus-within:text-secondary-2 transition-colors duration-300"
          width="25"
          height="25"
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

// Gender Selection Component
const GenderSelect = ({ selectedGender, setSelectedGender }: any) => (
  <div className="relative w-full group">
    <select
      className="w-full h-12 bg-transparent border-b-2 border-secondary-2/30 px-8 
                 text-primary-2 outline-none transition-all duration-300
                 focus:border-secondary-2 appearance-none cursor-pointer"
      value={selectedGender}
      onChange={(e) => setSelectedGender(e.target.value)}
      required
    >
      <option value="" disabled>
        Select Gender
      </option>
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="prefer-not-to-say">Prefer not to say</option>
    </select>
    <Icon
      icon="mdi:gender-male-female"
      className="absolute left-0 top-1/2 -translate-y-1/2 text-primary-2/50 w-6 h-6
                 group-focus-within:text-secondary-2 transition-colors duration-300"
      width="25"
      height="25"
    />
    <Icon
      icon="mdi:chevron-down"
      className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-2/50 w-4 h-4
                 pointer-events-none transition-colors duration-300"
      width="16"
      height="16"
    />
  </div>
);

export const RegisterModal = ({
  setShowPofconModal,
  eventId,
  eventTitle,
  eventLocation,
  eventStartTime,
  eventEndTime,
  onSuccess,
}: {
  setShowPofconModal: React.Dispatch<React.SetStateAction<boolean>>;
  eventId: number | null;
  eventTitle: string;
  eventLocation: string;
  eventStartTime: string;
  eventEndTime: string;
  onSuccess: () => void;
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    email: "",
    contact: "",
    artExp: "",
    subjectExp: "",
    portfolioLink: "", // Optional field
  });

  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleClose = () => {
    setIsExiting(true);
  };

  const handleAnimationComplete = () => {
    if (isExiting) {
      setShowPofconModal(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const { firstName, lastName, address, email, contact } = formData;

    if (!firstName || !lastName || !address || !email || !contact || !gender) {
      setErrorMessage("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    console.log("Form Data:", formData, "Gender:", gender);

    try {
      const response = await fetch("/api/admin-events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          EventID: eventId,
          eventData: { ...formData, gender },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Show success toast
        onSuccess();
        setShowPofconModal(false); // Close the modal
      } else {
        setErrorMessage(data.error || "An error occurred.");
      }
    } catch (error) {
      setErrorMessage("Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.3 }}
      onClick={handleClose}
      onAnimationComplete={handleAnimationComplete}
    >
      <motion.div
        className="relative w-full max-w-4xl h-fit bg-secondary-1 rounded-2xl overflow-hidden shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative circles */}
        <div className="absolute -left-32 -top-32 w-64 h-64 bg-primary-2/20 rounded-full" />
        <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-primary-2/30 rounded-full" />

        <div className="relative grid md:grid-cols-2 gap-8 md:p-10 p-6">
          {/* Left side - Form */}
          <div className="space-y-0">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-primary-2">
                Register for {eventTitle}
              </h2>
              <p className="text-primary-2/70">
                Fill out the form below to secure your spot
              </p>
            </div>

            <form className="py-10 flex flex-col gap-4" onSubmit={handleSubmit}>
              {/* Other Input Fields */}
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  icon="icon-park-solid:edit-name"
                  placeholder="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
                <InputField
                  icon="icon-park-solid:edit-name"
                  placeholder="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>

              <InputField
                icon="mdi:address-marker"
                placeholder="Mailing Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />

              <InputField
                icon="mdi:email"
                placeholder="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  icon="bxs:contact"
                  placeholder="Number"
                  type="number"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  error={errorMessage}
                />
                <GenderSelect
                  selectedGender={gender}
                  setSelectedGender={setGender}
                />

                <InputField
                  icon="icon-park-solid:edit-name"
                  placeholder="Total years of experience in art"
                  type="number"
                  name="artExp"
                  value={formData.artExp}
                  onChange={handleInputChange}
                />

                <InputField
                  icon="icon-park-solid:edit-name"
                  placeholder="Workshop subject years of experience"
                  type="number"
                  name="subjectExp"
                  value={formData.subjectExp}
                  onChange={handleInputChange}
                />

                <InputField
                  icon="icon-park-solid:edit-name"
                  placeholder="Online Portfolio if available"
                  type="text" // Changed to "text" for URL input
                  name="portfolioLink"
                  value={formData.portfolioLink}
                  onChange={handleInputChange}
                  required={false} // Made this field optional
                />
              </div>

              {errorMessage && <p className="text-red-500">{errorMessage}</p>}

              <motion.button
                type="submit"
                className="w-full py-3 mt-6 bg-primary-2 text-secondary-1 rounded-lg 
                         font-semibold uppercase tracking-wide transition-all duration-300
                         hover:bg-primary-2/90 focus:ring-2 focus:ring-primary-2/50 focus:ring-offset-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
              >
                {loading ? "Registering..." : "Register Now"}
              </motion.button>
            </form>
          </div>

          {/* Right side - Logo and decorative content */}
          <div className="hidden h-full md:flex flex-col -mt-10 items-center justify-center relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full max-w-xs "
            >
              <Logo color="text-primary-2 h-fit" width="auto" height="auto" />
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold text-primary-2">
                  Join us at {eventTitle}
                </h3>
                <p className="text-primary-2/70">
                  Connect with fellow professionals and expand your network
                </p>
              </div>
            </motion.div>
          </div>
          <ToastContainer />
        </div>
      </motion.div>
    </motion.div>
  );
};