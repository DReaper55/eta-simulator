import React from "react";

interface TextFieldProps {
  icon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  placeholder?: string;
  width?: string;
}

const TextField: React.FC<TextFieldProps> = ({
  icon,
  placeholder,
  suffixIcon,
  width
}) => {
  return (
    <div className={`flex items-center border border-gray-300 rounded-lg p-2`} style={{width: width}}>
      <div className="mr-2">{icon}</div>
      <input
        type="text"
        className="flex-1 bg-transparent outline-none"
        placeholder={placeholder}
      />
      {suffixIcon && <div className="mr-2">{suffixIcon}</div>}
    </div>
  );
};

export default TextField;
