import Link from "next/link";
import React, { FunctionComponent } from "react";
import clsx from "clsx";
type Props = {
  lable: string;
  href: string;
  Icon: FunctionComponent;
  onClick?: (e: any) => void;
  isActive: boolean;
};

function SideBarBtn({ href, Icon, lable, onClick, isActive }: Props) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={clsx(
        " flex gap-1 flex-col p-2 text-gray-700 text-xl rounded-lg ",
        isActive && "bg-slate-100"
      )}
    >
      <Icon />
      <span className="sr-only">{lable}</span>
    </Link>
  );
}

export default SideBarBtn;
