import { ClipLoader } from "react-spinners";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
      <ClipLoader color="#C49A6C" size={50} />
    </div>
  );
};

export default LoadingSpinner;



