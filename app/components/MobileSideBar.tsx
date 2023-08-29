"use client";
import React from "react";
import useRoutes from "../hooks/useRoutes";
import SideBarBtn from "./buttons/SideBarBtn";

type Props = {};

const MobileSideBar = (props: Props) => {
  const routes = useRoutes();
  return (
    <div className="flex sm:hidden p-2 justify-around text-2xl">
      {routes.map((route) => (
        <SideBarBtn
          href={route.href}
          onClick={route.onClick}
          key={route.lable}
          lable={route.lable}
          Icon={route.icon}
          isActive={route.active as boolean}
        />
      ))}
    </div>
  );
};

export default MobileSideBar;
