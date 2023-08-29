import clsx from "clsx";
import { da } from "date-fns/locale";
import { User } from "next-auth";
import React, { useEffect, useMemo, useState } from "react";
import { pusherClient } from "../libs/pusher";
import { Iconservations, IMessage } from "../type";

export const LastMessage = ({
  message,
  currentUser,
  conservationId,
}: {
  message?: IMessage;
  currentUser: User;
  conservationId: string;
}) => {
  const [lastedMessage, setLastedMessage] = useState(message);
  const checkSeen = useMemo(() => {
    return lastedMessage?.seen.find((user) => user.id == currentUser.id);
  }, [currentUser, lastedMessage]);
  useEffect(() => {
    const channel = pusherClient.subscribe(conservationId);
    const handleMessageSend = (data: { message: IMessage }) => {
      setLastedMessage((current) => {
        if (current && current.id == data.message.id) {
          return current;
        }
        return data.message;
      });
    };
    const handleMessageSeen = (data: { message: IMessage }) => {
      setLastedMessage((current) => {
        return data.message;
      });
    };

    channel.bind("message:seen", handleMessageSeen);
    channel.bind("message:send", handleMessageSend);
    // channel.bind("conservation:move_out", handleMoveOut);
    return () => {
      pusherClient.unsubscribe(conservationId as string);
      channel.unbind("message:send", handleMessageSend);
      channel.unbind("message:seen", handleMessageSeen);
      // channel.unbind("conservation:move_out", handleMoveOut);
    };
  }, [conservationId]);
  return (
    <span
      className={clsx(
        "text-base ",
        checkSeen?.id ? "font-light" : "font-semibold"
      )}
    >
      {!lastedMessage
        ? "Start new conservation!"
        : lastedMessage.image
        ? "Image sent"
        : lastedMessage.body}
    </span>
  );
};
