import EmptyConservation from "@/app/components/EmptyConservation";
import OnlineMount from "@/app/components/OnlineMount";
import UserList from "@/app/components/UserList";
import getUserList from "@/app/libs/getUserList";
import { signOut } from "next-auth/react";
type Props = {};

const page = async ({}: Props) => {
  const userList = await getUserList();

  return (
    <div className="flex flex-1 ">
      <OnlineMount></OnlineMount>
      <UserList userList={userList} />
      <EmptyConservation />
    </div>
  );
};
export default page;
