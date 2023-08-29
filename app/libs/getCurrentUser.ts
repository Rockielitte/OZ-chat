import { authOptions } from "./../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export const getCurrentUser = async () => {
  const session = await getServerSession(authOptions);
  return session;
};
