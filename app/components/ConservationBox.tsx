"use client";
import { User } from "@prisma/client";
import axios from "axios";
import clsx from "clsx";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useMemo, useLayoutEffect, useState } from "react";
import useConservation from "../hooks/useConservation";
import useOnlineUsers from "../store";
import { Iconservations } from "../type";
import Avatar from "./Avatar";
import { LastMessage } from "./LastMessage";
import SeenStatus from "./SeenStatus";
import noGroupAva from "../../public/noGroupAva.png";
import noAva from "../../public/NoAvatar.png";
interface Props {
  body: Iconservations;
}

const ConservationBox: React.FC<Props> = ({ body }) => {
  const route = useRouter();
  const pathName = useParams();
  const session = useSession();
  const onlineList = useOnlineUsers((state) => state.onlineUsers);

  const otherUser = useMemo(() => {
    return body.user.filter((us) => {
      return us.id != session.data?.user.id;
    });
  }, [body, session]);

  const handleConservation = useCallback(() => {
    route.push(`/conservations/${body.id}`);
  }, [route, body]);
  return (
    <div>
      {session.data?.user.id && (
        <div
          className={clsx(
            "flex p-2 hover:bg-slate-100 rounded-lg gap-2 justify-start items-center",
            pathName.id == body.id && "bg-slate-100"
          )}
          onClick={handleConservation}
        >
          {!body.isGroup ? (
            <Avatar
              src={otherUser[0]?.image || noAva}
              className="md:w-5/6"
              active={onlineList.includes(otherUser[0]?.id || "")}
            />
          ) : (
            <Avatar
              src={noGroupAva}
              isGroup
              className="md:w-5/6"
              active={true}
            />
          )}
          <div className="flex-1 p-1 flex flex-col gap-1 items-start">
            <span className="font-semibold ">
              {body.name
                ? body.name
                : otherUser.map((user) => user.name).toString()}
            </span>
            <LastMessage
              currentUser={session.data.user}
              message={
                body.messages?.length && body.messages?.length - 1 >= 0
                  ? body.messages[body.messages.length - 1]
                  : undefined
              }
              conservationId={body.id}
            />
          </div>
          <div>{format(new Date(body.lastMessageAt), "p")}</div>
        </div>
      )}
    </div>
  );
};

export default ConservationBox;
