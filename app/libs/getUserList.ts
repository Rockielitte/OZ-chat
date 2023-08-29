import { getCurrentUser } from "./getCurrentUser";
import prisma from "./prisma";
export default async function getUserList() {
  const currentUser = await getCurrentUser();
  if (!currentUser?.user.email) return [];
  try {
    const userList = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        email: {
          not: currentUser.user.email,
        },
      },
    });
    return userList;
  } catch (e) {
    console.log(e, "LOI VCL");
    return [];
  }
}
