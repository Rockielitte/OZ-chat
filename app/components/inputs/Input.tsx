import React from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import clsx from "clsx";
type Props = {
  id: string;
  label: string;
  type?: string;
  register: any;
  error: any;
  disabled?: boolean;
  placeholder?: string;
};

const Input: React.FC<Props> = ({
  id,
  label,
  type = "text",
  register,
  error,
  disabled,
  placeholder,
}) => {
  return (
    <div className={clsx("w-full flex flex-col tracking-wide")}>
      <label
        htmlFor={id}
        className="block text-gray-700 text-base font-bold mb-1 first-letter:uppercase"
      >
        {label}
      </label>
      <input
        type={type}
        {...register}
        id={id}
        disabled={disabled}
        className={clsx(
          " caret-primary place-content-center shadow-sm appearance-none border  tracking-wide rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-primary  bg-white/80",
          error && "border-red-500 text-red-500",
          disabled && " cursor-not-allowed"
        )}
        placeholder={placeholder}
      />
      <span className="text-red-500 text-xs py-1 tracking-wider">
        {error?.message}
      </span>
      {/* <span className="text-red-500 text-xs py-1 tracking-wide">
        Error input
      </span> */}
    </div>
  );
};
export default Input;
