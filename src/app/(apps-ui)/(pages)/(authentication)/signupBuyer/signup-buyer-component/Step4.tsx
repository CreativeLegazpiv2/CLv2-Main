export const Step4 = ({ formData, handleSubmit, prevStep, handleCancel }: any) => {
    return (
      <div className="w-full h-full flex flex-col gap-4 text-palette-1">
        <h2 className="font-bold text-xl mb-4">Step 4: Review</h2>
  
        {/* Review Information */}
        <div className="">
          <p className="mb-2">
            <span className="font-semibold">Username: </span>{formData.username}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Email: </span>{formData.email}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Name: </span>{formData.name}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Birthday: </span>{formData.bday}
          </p>
          {/* Add additional fields for review */}
          <p className="mb-2">
            <span className="font-semibold">Creative Field: </span>{formData.creativeField}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Address: </span>{formData.address}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Mobile Number: </span>{formData.mobileNo}
          </p>
        </div>
  
        {/* Navigation Buttons */}
        {/* <div className="flex justify-between mt-6">
          <button
            onClick={prevStep}
            className="bg-gray-300 text-black px-4 py-2 rounded"
          >
            Back
          </button>
          <button
            onClick={handleCancel}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </div> */}
      </div>
    );
  };
  