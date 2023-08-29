import React from "react";
import { format } from "date-fns";
const SeenStatus = ({ time }: { time: string }) => {
  return <div>{format(new Date(time), "p")}</div>;
};

export default SeenStatus;
