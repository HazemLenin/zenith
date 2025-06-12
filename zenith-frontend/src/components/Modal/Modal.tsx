import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  open: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({
  title,
  children,
  footer,
  open,
  onClose,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <h3 className="text-lg font-medium text-secondary-title">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 cursor-pointer"
            >
              <FontAwesomeIcon icon={faXmark} className="h-10 w-10" size="lg" />
            </button>
          </div>

          {/* Body */}
          <div className="mt-4">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="mt-6 flex justify-end border-t border-gray-200 pt-4">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
