import { useLocation } from "react-router-dom";

const Unauthorized = () => {
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Unauthorized Access
        </h1>
        <p className="text-gray-600 mb-4">
          You don't have permission to access this page.
        </p>
        <a href={from} className="text-blue-600 hover:text-blue-800 underline">
          Go back
        </a>
      </div>
    </div>
  );
};

export default Unauthorized;
