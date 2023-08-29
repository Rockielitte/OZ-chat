import React from "react";

type Props = {};

const EmptyConservation = (props: Props) => {
  return (
    <div className="hidden md:flex bg-slate-400 items-center justify-center flex-1">
      Choose a conservation or create a new one
    </div>
  );
};

export default EmptyConservation;
