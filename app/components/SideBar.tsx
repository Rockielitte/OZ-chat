"use client";
import { Dialog, Transition } from "@headlessui/react";
import { Session } from "inspector";
import { useSession } from "next-auth/react";
import React, { Fragment, useState } from "react";
import useRoutes from "../hooks/useRoutes";
import Avatar from "./Avatar";
import SideBarBtn from "./buttons/SideBarBtn";
import ProfileConversation from "./ProfileConversation";
import UserProfile from "./UserProfile";

type Props = {};
const SideBar = (props: Props) => {
  const routes = useRoutes();
  const session = useSession();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="p-2 font-semibold  flex-col gap-2 border-r shadow-sm hidden sm:flex h-full justify-between ">
      <Transition show={isOpen} as={Fragment}>
        <Dialog onClose={() => setIsOpen(false)} className="fixed inset-0 z-10">
          {/*
          Use one Transition.Child to apply one transition to the backdrop...
        */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          {/*
          ...and another Transition.Child to apply a separate transition
          to the contents.
        */}
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-500 transform"
            enterTo="translate-x-0"
            enterFrom="-translate-x-full"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="absolute  md:w-4/12 w-3/4 h-full left-0 bg-white">
              <UserProfile data={session.data?.user} active={true} />
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
      <div className="flex-col gap-4 flex items-center">
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
      <div
        onClick={() => {
          setIsOpen(true);
        }}
        className="cursor-pointer"
      >
        <Avatar src={session.data?.user.image as string} alt="userAvatar" />
      </div>
    </div>
  );
};

export default SideBar;
