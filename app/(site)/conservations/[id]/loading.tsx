"use client";
import Spinner from "@/app/components/Spinner";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Spinner></Spinner>
    </div>
  );
}
