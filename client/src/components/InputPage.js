import React from "react";

const Input = ({
  width,
  label,
  name,
  type,
  className,
  id,
  isRequired = false,
  placeholder,
  value,
  autoComplete,
  onChange,
}) => {
  return (
    <>
      <div className="relative mt-2 rounded-md shadow-sm">
        <label
          htmlFor={id}
          className="block mb-2 text-sm font-medium text-blue-900 dark:text-blue"
        >
          {label}
        </label>
        <input
          type={type}
          name={name}
          id={id}
          className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder={placeholder}
          onChange={onChange}
          required={isRequired}
          autoComplete={autoComplete}
        />
      </div>
    </>
  );
};

export default Input;
