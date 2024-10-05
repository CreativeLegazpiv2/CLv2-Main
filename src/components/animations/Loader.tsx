import React from 'react';

const Loader = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-white opacity-75 z-50">
      <div className="loader">Loading...</div>
      {/* You can replace the above line with your loading animation */}
    </div>
  );
};

export default Loader;
