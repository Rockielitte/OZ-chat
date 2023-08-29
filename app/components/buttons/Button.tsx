import clsx from "clsx";
import React, { ReactNode } from "react";
type Props = {
  name?: string;
  onClick?: () => void;
  disabled?: boolean;
  state?: string;
  Icon?: React.ReactNode;
  className?: String;
  type?: "submit" | "button";
};

const Button: React.FC<Props> = ({
  name,
  onClick,
  disabled,
  state,
  Icon,
  className,
  type,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(
        "flex gap-1  justify-center items-center",
        disabled
          ? "bg-primary text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed "
          : state == "primary"
          ? "bg-primary hover:bg-[#9a0546] text-white font-bold py-2 px-4 rounded "
          : "bg-transparent  text-black font-semibold py-2 px-4 border  hover:border-slate-400 rounded",
        className
      )}
      disabled={disabled}
    >
      {Icon && <span>{Icon}</span>}
      <span>{name}</span>
    </button>
  );
};

export default Button;
