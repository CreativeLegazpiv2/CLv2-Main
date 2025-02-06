// components/Loader.tsx
const Loader = () => {
    return (
      <div className="loader">
        <style jsx>{`
          .loader {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-size: 24px;
          }
        `}</style>
        Loading...
      </div>
    );
  };
  
  export default Loader;
  