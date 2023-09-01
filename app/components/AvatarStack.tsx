import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { User } from "@prisma/client";
import { AvatarGroup } from "@mui/material";
import noAvatar from "../../public/NoAvatar.png";
interface props {
  users: User[];
}

const StackAvatars: React.FC<props> = ({ users }) => {
  return (
    <AvatarGroup max={3}>
      {users.map((user: User, i: any) => {
        return (
          <Avatar
            key={i}
            alt={user.name || user.email || "OZ user"}
            src={user.image || "../../public/NoAvatar.png"}
          />
        );
      })}
    </AvatarGroup>
  );
};
export default StackAvatars;
