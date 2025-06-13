import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faXmark,
  faCircleInfo,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  onClose,
  duration = 5000,
}) => {
  const styles = {
    success:
      "bg-white border-l-4 border-emerald-500 text-emerald-700 shadow-lg hover:shadow-xl",
    error:
      "bg-white border-l-4 border-red-500 text-red-700 shadow-lg hover:shadow-xl",
    info: "bg-white border-l-4 border-blue-500 text-blue-700 shadow-lg hover:shadow-xl",
  };

  const icons = {
    success: faCheck,
    error: faXmark,
    info: faCircleInfo,
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <motion.div
      initial={{ x: 100, opacity: 0, scale: 0.9 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: 100, opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`${styles[type]} rounded-lg p-4 flex items-center space-x-3 min-w-[300px] relative group`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 500, damping: 30 }}
      >
        <FontAwesomeIcon icon={icons[type]} className="text-lg" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="font-medium flex-grow"
      >
        {message}
      </motion.p>
      <motion.button
        onClick={onClose}
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FontAwesomeIcon
          icon={faTimes}
          className="text-gray-400 hover:text-gray-600"
        />
      </motion.button>
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-current opacity-20"
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: duration / 1000, ease: "linear" }}
      />
    </motion.div>
  );
};

export default Toast;
