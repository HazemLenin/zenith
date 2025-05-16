import React from "react";
import { ToggleSwitch } from "flowbite-react";

interface SwitchProps {
  label?: string;
  onChange?: (value: boolean) => void;
  checked?: boolean;
}

const Switch: React.FC<SwitchProps> = ({
  label = "",
  onChange,
  checked = false,
}) => {
  const handleChange = (checked: boolean) => {
    onChange?.(checked);
  };

  return (
    <ToggleSwitch checked={checked} label={label} onChange={handleChange}  />
  );
};

export default Switch;
