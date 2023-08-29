import { Dialog } from "@headlessui/react";
import React, { ReactComponentElement } from "react";

interface Iprops {
  isOpen?: boolean;
  setIsOpen: (state: boolean) => void;
  children: React.ReactNode;
}

const Model: React.FC<Iprops> = ({ isOpen, setIsOpen, children }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        {/* The actual dialog panel  */}
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white">
          {children}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default Model;
