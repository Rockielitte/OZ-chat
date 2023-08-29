import { pusherServer } from "./../../../../libs/pusher";
import { Conservation } from "@prisma/client";
import prisma from "@/app/libs/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "./../../../../libs/getCurrentUser";
export const POST = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const session = await getCurrentUser();
  const { body, image }: { body: string; image: string } = await request.json();
  if (!session?.user.id)
    return new NextResponse("Unauthorized", {
      status: 401,
    });
  try {
    const newMessage = await prisma.message.create({
      include: {
        seen: true,
        sender: true,
      },
      data: {
        body: body,
        image: image,
        Conservation: {
          connect: {
            id: params.id,
          },
        },
        sender: {
          connect: { id: session.user.id },
        },
        seen: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
    const updateConservation = await prisma.conservation.update({
      where: {
        id: params.id,
      },
      data: {
        lastMessageAt: new Date(),
      },
      include: {
        messages: true,
        user: true,
      },
    });
    await pusherServer.trigger(params.id, "message:send", {
      message: newMessage,
    });

    return NextResponse.json(newMessage);
  } catch (error) {
    return new NextResponse("Invalid data", {
      status: 500,
    });
  }
};
