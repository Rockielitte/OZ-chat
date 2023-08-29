import MobileSideBar from "@/app/components/MobileSideBar";
import SideBar from "@/app/components/SideBar";
import React from "react";
const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col sm:flex-row h-screen bg-white">
      <SideBar />
      {children}
      <MobileSideBar />
    </div>
  );
};

export default layout;
