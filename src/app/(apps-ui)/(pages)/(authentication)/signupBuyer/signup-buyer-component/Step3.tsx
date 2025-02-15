import { Icon } from "@iconify/react/dist/iconify.js";
import { Input, Select, TextArea } from "./Signup";
import { Gender } from "@/services/authservice"
export const Step3 = ({ formData, handleChange, nextStep, prevStep }: any) => {
    return (
        <div className="w-full h-full flex flex-col gap-4 text-palette-1">
            <h2 className="font-bold text-xl">Step 2.2 Personal Details</h2>


            {/* Address Input */}
            <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                icon="mdi:home-outline"
            />
            {/* Mobile Number Input */}
            <Input
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
                placeholder="Mobile Number"
                type="tel"
                icon="mdi:cellphone"
            />


            {/* Bio Textarea */}
            <TextArea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Bio"
                icon="mdi:note-outline"
            />
        </div>
    );
};
