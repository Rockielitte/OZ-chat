"use client";
import { useSession } from "next-auth/react";
import pusherJs, { Members } from "pusher-js";
import { PusherEvent } from "pusher-js/types/src/core/connection/protocol/message-types";
import React, { PropsWithChildren, useEffect } from "react";
import { MemberName } from "typescript";
import { pusherClient } from "../libs/pusher";
import useOnlineUsers from "../store";

const OnlineMount: React.FC<PropsWithChildren> = ({ children }) => {
  const session = useSession();
  const setOnlineUser = useOnlineUsers((state) => state.setOnlineUsers);
  useEffect(() => {
    if (session.data?.user) {
      const pusherCli = new pusherJs("5979530e88ca7cc2f5ba", {
        cluster: "ap1",
        authEndpoint: "/api/pusher/auth",
        auth: {
          params: {
            userId: session.data.user.id,
            username: session.data.user.name,
            email: session.data.user.email,
          },
        },
      });

      var presenceChannel = pusherCli.subscribe("presence-online");
      const handleSubcribe = (members: Members) => {
        var onlineMems: string[] = [];
        members.each((mem: any) => {
          onlineMems = [...onlineMems, mem.id];
        });
        setOnlineUser(onlineMems, "RESET");
        console.log("RESET");
      };
      const handleADD = (member: any) => {
        setOnlineUser([member.id], "ADD");
        console.log("ADD");
      };
      const handleRemove = (member: any) => {
        console.log(member, "LLLLLL");

        setOnlineUser([member.id], "REMOVE");
        console.log("REMOVED");
      };
      presenceChannel.bind("pusher:subscription_succeeded", handleSubcribe);
      presenceChannel.bind("pusher:member_added", handleADD);
      presenceChannel.bind("pusher:member_removed", handleRemove);
      //   presenceChannel.bind("pusher:subscription_error", (err: any) => {
      //     console.log("KKKK", err);
      //   });
      return () => {
        presenceChannel.unbind("pusher:subscription_succeeded", handleSubcribe);
        presenceChannel.unbind("pusher:member_added", handleADD);
        presenceChannel.unbind("pusher:member_removed", handleRemove);
        presenceChannel.unsubscribe();
      };
    }
    return () => {};
  }, [session]);

  return <>{children}</>;
};

export default OnlineMount;
