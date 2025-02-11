import { Input } from "./Signup";

export const Step4 = ({ formData, handleChange, nextStep, prevStep }: any) => {
  return (
    <div className="w-full h-full flex flex-col gap-4 text-palette-1">
      <h2 className="font-bold text-xl">Step 3 Social Media</h2>

      {/* Instagram Input */}
      <Input
        name="instagram"
        value={formData.instagram}
        onChange={handleChange}
        placeholder="Instagram"
        icon="mdi:instagram" // Use an appropriate icon for Instagram
      />

      {/* Facebook Input */}
      <Input
        name="facebook"
        value={formData.facebook}
        onChange={handleChange}
        placeholder="Facebook"
        icon="mdi:facebook" // Use an appropriate icon for Facebook
      />

      {/* Twitter Input */}
      <Input
        name="twitter"
        value={formData.twitter}
        onChange={handleChange}
        placeholder="Twitter"
        icon="mdi:twitter" // Use an appropriate icon for Twitter
      />

      {/* Portfolio Link Input */}
      <Input
        name="portfolioLink"
        value={formData.portfolioLink}
        onChange={handleChange}
        placeholder="Portfolio Link"
        icon="mdi:web" // Use an appropriate icon for Portfolio Link
      />
    </div>
  );
};
