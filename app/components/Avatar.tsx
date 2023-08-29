import clsx from "clsx";
import Image, { StaticImageData } from "next/image";
import React from "react";
import noAvatar from "../../public/NoAvatar.png";
import noGroupAva from "../../public/noGroupAva.png";
interface Props {
  src: string | StaticImageData;
  alt?: string;
  className?: string;
  active?: boolean;
  isGroup?: boolean;
}

const Avatar: React.FC<Props> = ({
  src,
  alt = "avatar",
  className,
  active = true,
  isGroup,
}) => {
  return (
    <div className="relative">
      <div
        className={clsx(" rounded-full p-[4px] bg-white shadow-lg ", className)}
      >
        <Image
          src={src ? src : isGroup ? noGroupAva : noAvatar}
          alt={alt}
          width={30}
          height={30}
          className="h-full w-full rounded-full"
        />
      </div>

      {active && (
        <span className="absolute w-2 h-2 rounded-full right-1 top-1 bg-green-400" />
      )}
    </div>
  );
};

export default Avatar;
