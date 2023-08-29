import clsx from "clsx";
import { da } from "date-fns/locale";
import Image from "next/image";
import React, { useState } from "react";
import { IMessage } from "../type";
import Avatar from "./Avatar";
interface Iprops {
  data: IMessage;
  isSender: boolean;
}
const TextBox: React.FC<Iprops> = ({ data, isSender }) => {
  const [showSeen, setShowSeen] = useState(false);

  return (
    <div
      className={clsx(
        "w-full flex  gap-2 p-2 items-center justify-start",
        isSender && " flex-row-reverse "
      )}
      onMouseEnter={() => {
        setShowSeen(true);
      }}
      onMouseLeave={() => {
        setShowSeen(false);
      }}
    >
      {!isSender && <Avatar src={data.sender.image as string} />}
      <span
        className={clsx(
          " rounded-lg shadow-lg px-8 py-1 relative ",
          isSender && data.body && "bg-blue-600 text-white"
        )}
      >
        {data.body ? (
          data.body
        ) : (
          <div className="w-[150px]">
            <Image
              src={data.image as string}
              width={500}
              height={500}
              alt="image message"
              className="w-full "
            />
          </div>
        )}
        {showSeen && (
          <span className="h-1 flex gap-1 items-center absolute -bottom-3 left-0">
            {data.seen.map((user) => {
              console.log(user.image, "hha");

              return (
                <Avatar
                  key={user.id}
                  src={user.image as string}
                  className="w-4 h-4"
                  active={false}
                />
              );
            })}
            <span className="text-xs font-semibold text-slate-600">Seen</span>
          </span>
        )}
      </span>
    </div>
  );
};

export default TextBox;
