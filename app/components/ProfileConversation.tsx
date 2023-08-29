import { User } from "@prisma/client";
import { format } from "date-fns";
import React, { Fragment, useCallback, useState } from "react";
import { Iconservations } from "../type";
import Avatar from "./Avatar";
import AvatarStack from "./AvatarStack";
import Button from "@mui/material/Button";
import { AiFillDelete } from "react-icons/ai";
import Model from "./Model";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Spinner from "./Spinner";
interface props {
  data: Iconservations;
  otherUser: User[];
  active: boolean;
}
const ProfileConversation: React.FC<props> = ({ data, otherUser, active }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const route = useRouter();
  const handleDelete = useCallback(async () => {
    setIsLoading(true);
    axios
      .post("/api/conservations/delete", {
        id: data.id,
      })
      .then((res) => {
        setIsLoading(false);
        route.push("/conservations");
      })
      .catch((e) => {
        setIsLoading(false);
      });
  }, []);
  return (
    <div className="w-full h-full flex flex-col pl-10 mt-8 items-start gap-6">
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => {
            // setIsOpen(false);
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className=" max-w-md transform overflow-hidden rounded-2xl bg-white p-1 text-left align-middle shadow-xl transition-all">
                  <div
                    id="alert-additional-content-2"
                    className="p-4 mb-4 text-red-800  border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
                    role="alert"
                  >
                    <div className="flex items-center">
                      <svg
                        className="flex-shrink-0 w-4 h-4 mr-2"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                      </svg>
                      <span className="sr-only">Info</span>
                      <h3 className="text-lg font-medium">
                        This is a danger alert
                      </h3>
                    </div>
                    <div className="mt-2 mb-4 text-sm">
                      Deleting a conversation will permanently remove all
                      associated messages and cannot be undone. Please ensure
                      that you have backed up any important information or data
                      before proceeding with the deletion.
                    </div>
                    {isLoading ? (
                      <Spinner></Spinner>
                    ) : (
                      <div className="flex">
                        <button
                          type="button"
                          className="text-white bg-red-800 flex items-center gap-2 hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5 mr-2 text-center  dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                          onClick={handleDelete}
                        >
                          <AiFillDelete />
                          Delete
                        </button>
                        <button
                          type="button"
                          className="text-red-800 bg-transparent border border-red-800 hover:bg-red-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center dark:hover:bg-red-600 dark:border-red-600 dark:text-red-500 dark:hover:text-white dark:focus:ring-red-800"
                          data-dismiss-target="#alert-additional-content-2"
                          aria-label="Close"
                          onClick={() => {
                            setIsOpen(false);
                          }}
                        >
                          Dismiss
                        </button>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <div className="flex gap-2 items-start flex-col">
        <Avatar src={otherUser[0]?.image as string} active={active} />
        <span className="font-semibold ">
          {data.name
            ? data.name
            : otherUser.map((user) => user.name).join(", ")}
        </span>
        <span className="text-sm font-semibold">
          Created at:{" "}
          <span className="font-light ">
            {new Date(data.createAt).toISOString()}
          </span>
        </span>
      </div>
      <AvatarStack users={otherUser} />
      <Button
        variant="outlined"
        startIcon={<AiFillDelete />}
        color="error"
        onClick={() => setIsOpen(true)}
      >
        Delete conservation
      </Button>
    </div>
  );
};

export default ProfileConversation;
