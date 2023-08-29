import MobileSideBar from "@/app/components/MobileSideBar";
import SideBar from "@/app/components/SideBar";
import { getMessageList } from "@/app/libs/getMessageList";
import React from "react";
import { Iconservations } from "@/app/type";
import MessageList from "../../components/MessageList";
import OnlineMount from "@/app/components/OnlineMount";
import getUserList from "@/app/libs/getUserList";
const layout = async ({ children }: { children: React.ReactNode }) => {
  const conservationList = await getMessageList();
  const userList = await getUserList();
  return (
    <div className="flex flex-col sm:flex-row h-screen bg-white">
      <OnlineMount></OnlineMount>
      <SideBar />
      <MessageList userList={userList} conservationList={conservationList} />
      {children}
      <MobileSideBar />
    </div>
  );
};

export default layout;
