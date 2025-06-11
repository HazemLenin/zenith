import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-primary mb-4 animate-bounce">
          404
        </h1>
        <h2 className="text-4xl font-bold text-secondary-title mb-6">
          Page Not Found
        </h2>
        <p className="text-xl text-gray-700 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for seems to have vanished into thin
          air.
        </p>
        <Link
          to="/"
          className="inline-block bg-primary hover:bg-primary-active text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
