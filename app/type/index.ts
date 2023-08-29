import { Conservation, Message, User } from "@prisma/client";

export type Iconservations = Conservation & {
  user: User[];
  messages: (Message & {
    seen: User[];
    sender: User;
  })[];
};
export type IMessage = Message & {
  seen: User[];
  sender: User;
};
