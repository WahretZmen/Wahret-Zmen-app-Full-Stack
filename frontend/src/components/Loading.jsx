import { ClipLoader } from "react-spinners";

const LoadingSpinner = () => {
  return (

    <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
      <ClipLoader color="#C49A6C" size={50} />

    <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-white animate-fadeIn">
      {/* Optional: Wahret Zmen text for branding */}
      <h2 className="text-[#C49A6C] text-xl font-semibold mb-4 font-cairo tracking-wide">
        Wahret Zmen...
      </h2>
      <ClipLoader color="#C49A6C" size={55} speedMultiplier={1.2} />

    </div>
    </div>
  );
};

export default LoadingSpinner;




