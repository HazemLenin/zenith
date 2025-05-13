import { ReactNode, ChangeEvent } from "react";

interface InputProps {
  label?: string;
  value: string;
  placeholder?: string;
  type?: string;
  onChangeFun: (e: ChangeEvent<HTMLInputElement>) => void;
  icon?: ReactNode;
  required?: boolean;
}

export default function Input({
  type,
  placeholder,
  label,
  value,
  onChangeFun,
  icon,
  required,
}: InputProps) {
  return (
    <>
      <label className="block text-xl mb-2 font-medium text-[#2f327d]">
        {label}
      </label>
      {icon}
      <input
        type={type}
        className="w-full px-4 py-2 rounded-3xl border border-[#2a5c8a] 
        bg-[#ffffff] placeholder:text-[#94adc4] focus:outline-none 
        focus:ring-2 focus:ring-[#2a5c8a] disabled:bg-[#94adc4]"
        placeholder={placeholder}
        value={value}
        onChange={onChangeFun}
        required={required}
      />
    </>
  );
}
