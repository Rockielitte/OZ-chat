"use client";
import { Conservation, Message, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { useEffect, useMemo, useState } from "react";
import useConservation from "../hooks/useConservation";
import { pusherClient } from "../libs/pusher";
import { Iconservations } from "../type";
import ConservationBox from "./ConservationBox";
import _ from "lodash";
import { Channel } from "pusher-js";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Model from "./Model";
import Select from "react-select";
import Spinner from "./Spinner";
import Button from "./buttons/Button";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import clsx from "clsx";
type Props = {
  conservationList: Iconservations[];
  userList: User[];
};

function ConservationList({ conservationList, userList }: Props) {
  const [conservations, setConservations] = useState(conservationList);
  const session = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [groupMems, setGroupMems] = useState<String[]>([]);
  const [groupName, setGroupName] = useState<string>();
  const { handleSubmit } = useForm();
  const route = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
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
  useEffect(() => {
    let channel: Channel;
    const handleNewConservation = (data: {
      newConservation: Iconservations;
    }) => {
      console.log("SHIBA");

      setConservations((current) => {
        if (_.find(current, { id: data.newConservation.id })) {
          return current;
        }
        return [data.newConservation, ...current];
      });
    };
    const handleMoveOutConservation = (data: {
      newConservation: Iconservations;
    }) => {
      console.log("RAJDIFJ");

      setConservations((current) => {
        const index = _.findIndex(current, (o) => {
          return o.id == data.newConservation.id;
        });
        if (index < 0) {
          return current;
        } else {
          const newData = [...current];
          newData.splice(index, 1);
          console.log(newData, "LLLDAKLF");

          return [...newData];
        }
      });
    };
    if (session.data?.user.id) {
      channel = pusherClient.subscribe(session.data?.user.id as string);

      channel.bind("conservation:new", handleNewConservation);
      channel.bind("conservation:move_out", handleMoveOutConservation);
    }

    return () => {
      if (channel) {
        channel.unbind("conservation:new", handleNewConservation);
        channel.unbind("conservation:move_out", handleMoveOutConservation);

        pusherClient.unsubscribe(session.data?.user.id as string);
      }
    };
  }, [session.data?.user.id]);

  return (
    <div
      className={clsx(
        "overflow-y-auto min-w-[200px] p-2 md:border-r sm:flex flex-col gap-2 h-full  cursor-pointer border-r",
        params.id ? "hidden" : "w-full h-full md:w-auto md:h-auto"
      )}
    >
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
      <div className="flex justify-between p-4 pb-0 tracking-wide text-2xl font-semibold">
        <h1>Conservations</h1>
        <AiOutlineUsergroupAdd
          fontSize={40}
          className=" hover:bg-slate-100 p-1 rounded-md shadow-sm"
          onClick={() => {
            setIsOpen(true);
          }}
        ></AiOutlineUsergroupAdd>
      </div>
      {conservations?.map((conservation) => {
        return <ConservationBox body={conservation} key={conservation.id} />;
      })}
    </div>
  );
}

export default ConservationList;
