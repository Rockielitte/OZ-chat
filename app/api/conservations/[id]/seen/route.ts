import { json } from "stream/consumers";
import { pusherServer } from "./../../../../libs/pusher";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prisma";
import { includes } from "lodash";
import { getCurrentUser } from "./../../../../libs/getCurrentUser";
export const POST = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const session = await getCurrentUser();

  try {
    const conservation = await prisma.conservation.findUnique({
      where: {
        id: params.id,
      },
      include: {
        messages: {
          include: {
            seen: true,
            sender: true,
          },
        },
      },
    });
    if (conservation?.messages.length && conservation.messages.length > 0) {
      const lastMessage =
        conservation?.messages[conservation.messages.length - 1];
      if (lastMessage?.seenIds.indexOf(session?.user.id as string) !== -1) {
        return NextResponse.json(lastMessage);
      }

      const updateMessage = await prisma.message.update({
        where: {
          id: lastMessage.id,
        },
        data: {
          seen: {
            connect: {
              id: session?.user.id,
            },
          },
        },
        include: {
          seen: true,
          sender: true,
        },
      });
      await pusherServer.trigger(params.id, "message:seen", {
        message: updateMessage,
      });
      return NextResponse.json(updateMessage);
    }
    return new NextResponse("Welcome message", {
      status: 200,
    });
  } catch (error) {
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
};
