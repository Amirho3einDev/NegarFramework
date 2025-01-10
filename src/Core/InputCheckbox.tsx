import React from "react";
import { Checkbox } from "primereact/checkbox";

interface InputCheckboxProps {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

const InputCheckbox: React.FC<InputCheckboxProps> = ({ value, onChange, disabled }) => {
  return (
    <Checkbox
      checked={value}
      onChange={(e) => onChange(e.checked || false)}
      disabled={disabled}
    />
  );
};

export default InputCheckbox;
