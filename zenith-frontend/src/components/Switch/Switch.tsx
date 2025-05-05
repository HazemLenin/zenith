import React from "react";
import { ToggleSwitch } from "flowbite-react";

interface SwitchProps {
  label?: string;
  onChange?: (value: boolean) => void;
  initialState?: boolean;
}

const Switch: React.FC<SwitchProps> = ({
  label = "",  // Changed from "Toggle" to empty string
  onChange,
  initialState = false,
}) => {
  const [isEnabled, setIsEnabled] = React.useState(initialState);

  const handleChange = (checked: boolean) => {
    setIsEnabled(checked);
    onChange?.(checked);
  };

  return (
    <div className="ml-4">
      <ToggleSwitch
        checked={isEnabled}
        label=""  // Set empty label here
        onChange={handleChange}
        aria-label={label || "switch"}  // Keep aria-label for accessibility
      />
    </div>
  );
};

export default Switch;