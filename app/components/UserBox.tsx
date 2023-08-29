"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import useOnlineUsers from "../store";
import Avatar from "./Avatar";
import { LastMessage } from "./LastMessage";
import SeenStatus from "./SeenStatus";
interface Props {
  id: string;
  name: string;
  image: string;
}

const UserBox: React.FC<Props> = ({ id, name, image }) => {
  const userOnline = useOnlineUsers((state) => state.onlineUsers);
  console.log(userOnline, "FFFFF");

  const route = useRouter();
  const handleMessage = useCallback(async () => {
    axios
      .post("/api/conservations", {
        userId: id,
        name: name,
        isGroup: false,
        members: [],
      })
      .then((res) => {
        route.push(`/conservations/${res.data.id}`);
      });
  }, [id, name]);

  return (
    <div
      className="flex p-2 hover:bg-slate-200 rounded-lg gap-2 justify-start items-center"
      onClick={handleMessage}
    >
      <Avatar
        src={image}
        className="md:w-5/6"
        active={userOnline.indexOf(id) > -1}
      />
      <div className="flex-1 p-1 flex flex-col gap-1 items-start">
        <span className="font-semibold ">{name}</span>
        {/* <LastMessage /> */}
      </div>
      {/* <SeenStatus /> */}
    </div>
  );
};

export default UserBox;
