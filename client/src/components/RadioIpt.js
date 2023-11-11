import React from "react";

const RadioIpt = ({ name, label, id, value, onChange }) => {
  return (
    <span className=" m-4">
      <input
        id={`inline-radio ${id}`}
        type="radio"
        value={value}
        name={name}
        onChange={onChange}
        className="w-4 h-4 text-blue-600 bg-blue-100 border-blue-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-blue-800 focus:ring-2 dark:bg-blue-700 dark:border-blue-600"
      />
      <label
        htmlFor={`inline-radio ${id}`}
        className="ml-2 text-sm font-medium text-blue-900 dark:text-blue mt-2 mb-2"
      >
        {label}
      </label>
    </span>
  );
};

export default RadioIpt;
