"use client";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { useEffect, useMemo, useState } from "react";
import { AiOutlineUsergroupAdd } from "react-icons/ai";

import getUserList from "../libs/getUserList";
import useOnlineUsers from "../store";
import Model from "./Model";
import UserBox from "./UserBox";
import Select from "react-select";
import { useForm } from "react-hook-form";
import axios from "axios";
import Button from "./buttons/Button";
import Spinner from "./Spinner";
import { useRouter } from "next/navigation";
type Props = {
  userList: User[] | null;
};

function UserList({ userList }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();
  const [groupMems, setGroupMems] = useState<String[]>([]);
  const [groupName, setGroupName] = useState<string>();
  const { handleSubmit } = useForm();
  const route = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const options = useMemo(
    () =>
      userList?.map((us) => {
        return { value: us.id, label: us.name };
      }),
    [userList]
  );
  const groupSubmit = async (formData: any) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/conservations", {
        isGroup: true,
        name: groupName,
        members: [...groupMems],
      });
      if (response.data) {
        setIsLoading(false);
        setIsOpen(false);
        route.push(`/conservations/${response.data.id}`);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (session.data?.user) {
      setGroupMems([session.data.user.id]);
    }
  }, [session.data]);

  return (
    <div className="w-full h-full md:w-auto md:h-auto">
      <Model isOpen={isOpen} setIsOpen={() => {}}>
        <form
          className="bg-white w-full px-8 pt-6 pb-8 md:min-w-[500px]"
          onSubmit={handleSubmit(groupSubmit)}
        >
          <h1 className="w-full text-center text-xl font-semibold text-gray-700 py-4 uppercase">
            Create group
          </h1>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="Groupname"
            >
              Group Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="Groupname"
              disabled={isLoading}
              type="text"
              placeholder="Groupname"
              onChange={(e) => {
                setGroupName(e.target.value);
              }}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Members
            </label>
            <Select
              isDisabled={isLoading}
              options={options}
              isMulti
              onChange={(options: any) => {
                setGroupMems(
                  options.map(
                    (obj: { label: string; value: string }) => obj.value
                  )
                );
              }}
            />
          </div>
          {isLoading ? (
            <Spinner />
          ) : (
            <div className="flex items-center  gap-2 justify-between w-full">
              <Button
                name="Create"
                state="primary"
                className=" text-gray-800  hover:border-none border-none text-base flex-1"
              ></Button>
              <Button
                name="Cancel"
                className=" text-gray-800  hover:bg-slate-200 border-none text-base flex-1"
                onClick={() => {
                  setIsOpen(false);
                }}
              ></Button>
            </div>
          )}
        </form>
      </Model>
      <div className="overflow-y-auto min-w-[200px] p-2 md:border-r flex flex-col gap-2 h-full  cursor-pointer">
        <div className="flex justify-start p-4 pb-0 tracking-wide text-2xl font-semibold">
          <div className="flex items-center justify-between w-full pb-2 border-b">
            <span>User</span>
            <AiOutlineUsergroupAdd
              fontSize={40}
              className=" hover:bg-slate-100 p-1 rounded-md shadow-sm"
              onClick={() => {
                setIsOpen(true);
              }}
            ></AiOutlineUsergroupAdd>
          </div>
        </div>
        {userList?.map((user) => {
          return (
            <UserBox
              key={user.id}
              id={user.id}
              name={user.name ? user.name : `OZ user (${user.email})`}
              image={user.image as string}
            />
          );
        })}
      </div>
    </div>
  );
}

export default UserList;
