"use client";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import React from "react";
import { BsFillChatDotsFill } from "react-icons/bs";
import useConservation from "./useConservation";
import { signOut } from "next-auth/react";
import { FaUserCircle } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
const useRoutes = () => {
  const pathName = usePathname();
  const [, conservationId] = useConservation();
  const routes = useMemo(
    () => [
      {
        lable: "Chat",
        href: "/conservations",
        icon: BsFillChatDotsFill,
        active: pathName === "/conservations" || !!conservationId,
      },
      {
        lable: "Users",
        href: "/users",
        icon: FaUserCircle,
        active: pathName === "/users",
      },
      {
        lable: "SignOut",
        href: "#",
        icon: FaSignOutAlt,
        onClick: (e: any) => {
          e.preventDefault();
          signOut();
        },
      },
    ],
    [pathName, conservationId]
  );
  return routes;
};

export default useRoutes;
