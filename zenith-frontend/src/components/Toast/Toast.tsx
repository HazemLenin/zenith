import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faXmark,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  id: string;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, id }) => {
  const styles = {
    success:
      "bg-white border-l-4 border-emerald-500 text-emerald-700 shadow-lg",
    error: "bg-white border-l-4 border-red-500 text-red-700 shadow-lg",
    info: "bg-white border-l-4 border-blue-500 text-blue-700 shadow-lg",
  };

  const icons = {
    success: faCheck,
    error: faXmark,
    info: faCircleInfo,
  };

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`${styles[type]} rounded-lg p-4 flex items-center space-x-3 min-w-[300px]`}
    >
      <FontAwesomeIcon icon={icons[type]} className="text-lg" />
      <p className="font-medium flex-grow">{message}</p>
    </motion.div>
  );
};

export default Toast;
