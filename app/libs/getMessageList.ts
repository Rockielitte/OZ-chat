import { getCurrentUser } from "./getCurrentUser";
import client from "./prisma";

export const getMessageList = async () => {
  const session = await getCurrentUser();
  if (!session?.user.id) {
    return [];
  }
  try {
    const messageList = await client.conservation.findMany({
      orderBy: {
        lastMessageAt: "desc",
      },
      where: {
        userIds: {
          has: session?.user.id,
        },
      },
      include: {
        user: true,
        messages: {
          include: {
            sender: true,
            seen: true,
          },
        },
      },
    });
    return messageList;
  } catch (error) {
    console.log("Loi roi");
    return [];
  }
};
