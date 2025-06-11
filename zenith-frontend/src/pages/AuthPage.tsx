import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "../components/auth/LoginForm";
import SignUpForm from "../components/auth/SignUpForm";

const AuthSwitch: React.FC<{ isLogin: boolean }> = ({ isLogin }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center mb-8">
      <div className="relative inline-flex items-center bg-gray-50 rounded-full p-1 shadow-sm border border-gray-200 w-2/3">
        <motion.div
          className="absolute h-full bg-primary rounded-full"
          initial={false}
          animate={{
            x: isLogin ? 0 : "100%",
            width: "50%",
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
        <button
          onClick={() => navigate("/login")}
          className={`relative w-1/2 px-6 py-2.5 rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer ${
            isLogin ? "text-white" : "text-gray-700 hover:text-gray-900"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => navigate("/signup")}
          className={`relative w-1/2 px-6 py-2.5 rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer ${
            !isLogin ? "text-white" : "text-gray-700 hover:text-gray-900"
          }`}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

const FormContent: React.FC<{ isLogin: boolean; onSwitch: () => void }> = ({
  isLogin,
  onSwitch,
}) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {isLogin ? (
          <LoginForm onSwitch={onSwitch} />
        ) : (
          <SignUpForm onSwitch={onSwitch} />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

const AuthPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === "/login";

  const handleSwitch = () => {
    navigate(isLogin ? "/signup" : "/login");
  };

  return (
    <div className="min-h-screen h-screen relative overflow-hidden">
      {/* Layer 1: Background Image with Welcome Text */}
      <div className="hidden lg:block absolute inset-0">
        <div className="absolute inset-0 bg-black/50" />
        <img
          src="/group-studying.jpg"
          alt="Students studying together"
          className="w-full h-full object-cover"
        />
        {/* Left side welcome text */}
        <div className="absolute right-0 inset-y-0 w-1/2 flex items-center justify-center text-white p-8">
          <div className="max-w-md text-center">
            <h1 className="text-4xl font-bold mb-4">Join Zenith</h1>
            <p className="text-lg">
              Create your account and start your journey with our community of
              learners and educators.
            </p>
          </div>
        </div>
        {/* Right side welcome text */}
        <div className="absolute left-0 inset-y-0 w-1/2 flex items-center justify-center text-white p-8">
          <div className="max-w-md text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
            <p className="text-lg">
              Sign in to continue your learning journey and access your
              personalized dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Layer 2: Moving Form Section */}
      {/* Mobile: no animation, always left-aligned */}
      <div className="lg:hidden w-full h-full fixed top-0 flex items-center justify-center p-8 bg-white left-0">
        <div className="w-full max-w-md relative z-10 mt-16">
          <AuthSwitch isLogin={isLogin} />
          <FormContent isLogin={isLogin} onSwitch={handleSwitch} />
        </div>
      </div>

      {/* Desktop: animated motion.div */}
      <motion.div
        className={`hidden lg:flex w-1/2 h-full fixed top-0 items-center justify-center p-8 bg-white ${
          isLogin ? "lg:left-0" : "lg:left-1/2"
        } left-0`}
        animate={{ left: isLogin ? "0%" : "50%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Decorative gradient shapes - hidden on mobile */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-primary to-primary/80 transform -skew-y-6 origin-top-left" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-primary/80 to-primary/60 transform skew-y-6 origin-top-right" />
        <div className="w-full max-w-md relative z-10 mt-16">
          <div className="flex justify-center mb-3">
            <img src="/logo.png" alt="Zenith Logo" className="w-1/3 h-auto" />
          </div>
          <AuthSwitch isLogin={isLogin} />
          <FormContent isLogin={isLogin} onSwitch={handleSwitch} />
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
