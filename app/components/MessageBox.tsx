"use client";
import { useSession } from "next-auth/react";
import React, { Fragment, useMemo, useState } from "react";
import { Iconservations } from "../type";
import Avatar from "./Avatar";
import { IoIosMore } from "react-icons/io";
import MessageBody from "./MessageBody";
import MessageInput from "./MessageInput";
import useOnlineUsers from "../store";
import Model from "./Model";
import { Dialog, Transition } from "@headlessui/react";
import ProfileConversation from "./ProfileConversation";
import noAva from "../../public/NoAvatar.png";
export const MessageBox = ({ data }: { data: Iconservations }) => {
  const [isOpen, setIsOpen] = useState(false);
  const onlineUsers = useOnlineUsers((state) => state.onlineUsers);
  const session = useSession();
  const otherUser = useMemo(() => {
    if (!data) return [];
    return data.user.filter((us) => {
      return us.id != session.data?.user.id;
    });
  }, [data, session]);
  return (
    <div className="h-full flex flex-col px-2 flex-1 min-h-0 ">
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
            enterFrom="translate-x-full"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="absolute  md:w-4/12 w-3/4 h-full right-0 bg-white">
              <ProfileConversation
                data={data}
                active={onlineUsers.includes(otherUser[0]?.id)}
                otherUser={otherUser}
              />
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
      <div className="w-full flex justify-between py-2 px-4 border-b shadow-sm items-center">
        <div className="flex gap-2 items-center">
          <Avatar
            src={(otherUser[0]?.image as string) || noAva}
            active={
              otherUser[0] ? onlineUsers.includes(otherUser[0]?.id) : false
            }
          />
          <span className="font-semibold ">
            {data.name
              ? data.name
              : otherUser.map((user) => user.name).join(", ")}
          </span>
        </div>
        <span
          className="cursor-pointer"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <IoIosMore size={20} />
        </span>
      </div>
      <MessageBody
        otherUsers={otherUser}
        data={data.messages}
        sender={session.data?.user.id as string}
        conservationId={data.id}
      />
      <MessageInput conservationId={data.id} />
    </div>
  );
};
