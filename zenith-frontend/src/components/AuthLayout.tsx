import React, { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AuthLayoutProps {
  children: ReactNode;
  isLogin: boolean;
  onSwitch: () => void;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  isLogin,
  onSwitch,
}) => {
  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-primary/20 z-10" />
        <img
          src="/group-studying.jpg"
          alt="Students studying together"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-white text-center px-8">
            <h1 className="text-4xl font-bold mb-4">
              {isLogin ? "Welcome Back!" : "Welcome to Learning"}
            </h1>
            <p className="text-lg">
              {isLogin
                ? "Continue your learning journey with us."
                : "Join our community of learners and start your educational journey today."}
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <motion.div
        initial={{ x: isLogin ? 0 : "100%" }}
        animate={{ x: 0 }}
        exit={{ x: isLogin ? "-100%" : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full lg:w-1/2 flex items-center justify-center bg-background p-8"
      >
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-secondary-title mb-2">
              {isLogin ? "Sign In" : "Create Account"}
            </h2>
            <p className="text-gray-700">
              {isLogin
                ? "Welcome back! Please enter your details."
                : "Join our learning community today"}
            </p>
          </div>

          <div className="mb-8">
            <div className="relative flex items-center h-12 w-full max-w-[450px] rounded-full overflow-hidden bg-gray-200">
              <input
                id="option1"
                name="options"
                type="radio"
                className="hidden peer/option1"
                checked={!isLogin}
                onChange={onSwitch}
              />
              <label
                htmlFor="option1"
                className="option flex-1 text-center cursor-pointer rounded-full z-10 transition-all duration-500 font-medium text-lg peer-checked/option1:text-white peer-checked/option1:font-bold peer-not-checked/option1:text-gray-700"
              >
                SIGN UP
              </label>
              <input
                id="option2"
                name="options"
                type="radio"
                className="hidden peer/option2"
                checked={isLogin}
                onChange={onSwitch}
              />
              <label
                htmlFor="option2"
                className="option flex-1 text-center cursor-pointer rounded-full z-10 transition-all duration-500 font-medium text-lg peer-checked/option2:text-white peer-checked/option2:font-bold peer-not-checked/option2:text-gray-700"
              >
                LOGIN
              </label>
              <motion.span
                layout
                className="background absolute w-[49%] h-[44px] top-1 rounded-full bg-primary"
                initial={false}
                animate={{
                  left: isLogin ? "1%" : "50%",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
