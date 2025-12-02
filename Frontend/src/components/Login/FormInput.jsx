import React from "react";

function FormInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  rightNode,
}) {
  return (
    <div className="relative">
      <label className="block text-md font-medium text-gray-600 mb-1">
        {label}
      </label>
      <input
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all duration-300"
      />
      {rightNode && (
        <div className="absolute right-4 top-7 flex h-12 items-center text-sm">
          {rightNode}
        </div>
      )}
    </div>
  );
}

export default FormInput;
