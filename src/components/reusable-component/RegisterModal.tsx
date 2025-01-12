  import { motion } from "framer-motion";
  import { useState } from "react";
  import { Logo } from "./Logo";
  import { Icon } from "@iconify/react/dist/iconify.js";
  import { ToastContainer, toast } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css"; // Import toast CSS
  import { X } from "lucide-react";

  interface InputFieldProps {
    icon: any;
    placeholder: string;
    type?: string;
    name: string;
    value: string;
    error?: string;
    required?: boolean;
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
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
            <span
              className={`mr-1 text-sm text-gray-700 absolute ${
                isContactField ? "px-8" : ""
              }`}
            >
              +63
            </span>
          )}
          {type === "textarea" ? (
            <textarea
              className={`w-full h-12 bg-transparent border-b-2 border-secondary-2/30 px-8 placeholder:text-sm
                        text-primary-2 placeholder:text-primary-2/50 outline-none transition-all duration-300
                        focus:border-secondary-2 resize-none`}
              name={name}
              placeholder={placeholder}
              autoComplete="off"
              required={required}
              value={value}
              onChange={onChange}
            />
          ) : (
            <input
              className={`w-full h-12 bg-transparent border-b-2 border-secondary-2/30 placeholder:text-sm ${
                isContactField ? "pl-20" : "px-8"
              }
                        text-primary-2 placeholder:text-primary-2/50 outline-none transition-all duration-300 
                        focus:border-secondary-2 [&:-webkit-autofill]:transition-[background-color_5000s_ease-in-out_0s]`}
              type={type}
              name={name}
              placeholder={placeholder}
              autoComplete="off"
              required={required}
              value={value}
              onChange={onChange}
            />
          )}
          <Icon
            icon={icon}
            className={`absolute left-0  -translate-y-1/2 text-primary-2/50 w-6 h-6
                    group-focus-within:text-secondary-2 transition-colors duration-300 ${
                      type === "textarea" ? "top-4" : "top-1/2"
                    }`}
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
    <div className="relative w-full group text-sm">
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
    contact, // Add contact prop
    onSuccess,
  }: {
    setShowPofconModal: React.Dispatch<React.SetStateAction<boolean>>;
    eventId: number | null;
    eventTitle: string;
    eventLocation: string;
    eventStartTime: string;
    eventEndTime: string;
    contact?: string; // Optional contact prop
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
      animationExp: "",
      portfolioLink: "",
      fb: "",
      ig: "",
      commitment: false,
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

    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value, type } = e.target;

      if (e.target instanceof HTMLInputElement && type === "checkbox") {
        const { checked } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: checked,
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setErrorMessage("");

      const {
        firstName,
        lastName,
        address,
        email,
        contact,
        artExp,
        animationExp,
        commitment,
      } = formData;

      if (
        !firstName ||
        !lastName ||
        !address ||
        !email ||
        !contact ||
        !gender ||
        !artExp ||
        !animationExp ||
        !commitment
      ) {
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
          console.log("Registration successful, calling onSuccess"); // Debugging
          onSuccess(); // Ensure this is called
          setShowPofconModal(false);
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
          className="relative w-full max-w-7xl h-fit bg-secondary-1 rounded-2xl overflow-hidden shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <X
            className="absolute right-4 top-4 z-[100] cursor-pointer hover:scale-110 duration-300"
            onClick={handleClose}
          />
          {/* Decorative circles */}
          <div className="absolute -left-32 -top-32 w-96 h-96 bg-primary-2/20 rounded-full" />
          <div className="absolute -right-32 -bottom-32 w-[400px] h-[400px] bg-primary-2/40 rounded-full" />
  
          <div className="w-full relative flex justify-center items-center gap-8 md:p-10 p-6">
            {/* Left side - Form */}
            <div className="space-y-0 w-full">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-primary-2">
                  Register for {eventTitle}
                </h2>
                <p className="text-primary-2/70">
                  Fill out the form below to secure your spot
                </p>
              </div>
  
              {/* Display Contact Information */}
              {contact && (
                <div className="mt-4 p-4 bg-primary-2/10 rounded-lg">
                  <h3 className="text-lg font-semibold text-primary-2">
                    Contact Information
                  </h3>
                  <p className="text-primary-2/70">{contact}</p>
                </div>
              )}
  
              <form
                className="h-full py-10 grid md:grid-cols-3 grid-cols-2 gap-4"
                onSubmit={handleSubmit}
              >
                {/* Personal Information */}
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
  
                {/* Online Portfolio */}
                <InputField
                  icon="icon-park-solid:edit-name"
                  placeholder="Online Portfolio (if available)"
                  type="text"
                  name="portfolioLink"
                  value={formData.portfolioLink}
                  onChange={handleInputChange}
                  required={false}
                />
  
                {/* Facebook Profile */}
                <InputField
                  icon="mdi:facebook"
                  placeholder="Facebook Profile (optional)"
                  type="text"
                  name="fb"
                  value={formData.fb}
                  onChange={handleInputChange}
                  required={false}
                />
                {/* Instagram Profile */}
                <div className="md:col-span-1 col-span-2">
                  <InputField
                    icon="mdi:instagram"
                    placeholder="Instagram Profile (optional)"
                    type="text"
                    name="ig"
                    value={formData.ig}
                    onChange={handleInputChange}
                    required={false}
                  />
                </div>
  
                {/* Art Experience */}
                <div className="md:col-span-3 col-span-2">
                  <InputField
                    icon="icon-park-solid:edit-name"
                    placeholder="Art experience"
                    type="textarea"
                    name="artExp"
                    value={formData.artExp}
                    onChange={handleInputChange}
                  />
                </div>
  
                <div className="md:col-span-3 col-span-2">
  <InputField
    icon="icon-park-solid:edit-name"
    placeholder={`Please share your experience related to ${eventTitle}`}
    type="textarea"
    name="eventExp" // Changed from animationExp to eventExp
    value={formData.eventExp}
    onChange={handleInputChange}
    label="Relevant Experience"
    helperText="Tell us about your background, skills, or experience relevant to this event"
  />
</div>
  
                {/* Commitment */}
                <div className="flex items-start col-span-2">
                  <input
                    type="checkbox"
                    name="commitment"
                    id="commitment"
                    checked={formData.commitment}
                    onChange={handleInputChange}
                    required
                    className="mr-2 mt-1 "
                  />
                  <label htmlFor="commitment" className="text-primary-2">
                    I commit to attending the event if selected.
                  </label>
                </div>
  
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
  
                <motion.button
                  type="submit"
                  className="w-full col-span-2 py-3 mt-6 bg-primary-2 text-secondary-1 rounded-lg 
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
            <div className="md:w-[60%] w-full h-full hidden md:flex justify-center items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="w-full max-w-xs h-full"
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
          </div>
        </motion.div>
      </motion.div>
    );
  };
  
