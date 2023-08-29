import { User } from "@prisma/client";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { pusherClient } from "../libs/pusher";
import { IMessage } from "../type";
import TextBox from "./TextBox";
import _ from "lodash";
interface Iprops {
  data: IMessage[];
  sender: string;
  otherUsers: User[];
  conservationId?: string;
}
const MessageBody: React.FC<Iprops> = ({
  data,
  sender,
  otherUsers,
  conservationId,
}) => {
  const bottomMess = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(data);
  useEffect(() => {
    if (data.length > 0)
      axios.post(`/api/conservations/${conservationId}/seen`);
  }, [conservationId]);
  useEffect(() => {
    bottomMess.current?.scrollIntoView();
    const channel = pusherClient.subscribe(conservationId as string);
    const handleMessageSend = (data: { message: IMessage }) => {
      console.log("pusher message send");
      console.log(data);

      axios.post(`/api/conservations/${conservationId}/seen`);
      setMessages((current) => {
        if (_.find(current, { id: data.message.id })) {
          return current;
        }
        return [...current, data.message];
      });
      bottomMess.current?.scrollIntoView();
    };
    const handleMessageSeen = (data: { message: IMessage }) => {
      setMessages((current) =>
        current.map((mess) => {
          if (mess.id != data.message.id) {
            return mess;
          }
          return data.message;
        })
      );
    };
    channel.bind("message:seen", handleMessageSeen);
    channel.bind("message:send", handleMessageSend);
    return () => {
      pusherClient.unsubscribe(conservationId as string);
      channel.unbind("message:send", handleMessageSend);
      channel.unbind("message:seen", handleMessageSeen);
    };
  }, [conservationId]);
  return (
    <div className="relative flex-1 w-full ">
      <div className="absolute inset-0 h-full  overflow-y-auto flex flex-col ">
        {messages.length == 0 ? (
          <span className="font-semibold self-center justify-self-end">
            {`Start a new conservation with 
        ${otherUsers.map((us) => us.name).join(", ")}`}
          </span>
        ) : (
          <>
            {messages.map((mess) => (
              <TextBox
                key={mess.id}
                data={mess}
                isSender={sender == mess.sender.id}
              ></TextBox>
            ))}
          </>
        )}
        <div ref={bottomMess} className="py-4 justify-self-end" />
      </div>
    </div>
  );
};

export default MessageBody;
