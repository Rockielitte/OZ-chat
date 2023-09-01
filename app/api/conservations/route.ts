import { pusherServer } from "./../../libs/pusher";
import { getCurrentUser } from "./../../libs/getCurrentUser";
import { NextResponse } from "next/server";
import client from "@/app/libs/prisma";
interface IReq {
  userId: string;
  isGroup: boolean;
  members: string[];
  name: string;
}
export const POST = async (request: Request) => {
  const session = await getCurrentUser();

  if (!session?.user.email || !session.user.id)
    return new NextResponse("Unauthorized", {
      status: 401,
    });
  const { userId, isGroup, members, name }: IReq = await request.json();
  if (isGroup && (!members || members.length < 2 || !name)) {
    return new NextResponse("Invalid data", { status: 400 });
  }

  try {
    if (isGroup) {
      const conservation = await client.conservation.create({
        data: {
          name: name,
          isGroup: isGroup,
          user: {
            connect: [
              ...members.map((member: string) => ({ id: member })),
              {
                id: session.user.id,
              },
            ],
          },
        },
        include: {
          user: true,
        },
      });
      conservation.user.forEach(async (us) => {
        await pusherServer.trigger(us.id, "conservation:new", {
          newConservation: conservation,
        });
      });
      return NextResponse.json(conservation);
    }
    const existedConservation = await client.conservation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [session.user.id, userId],
            },
          },
          {
            userIds: {
              equals: [userId, session.user.id],
            },
          },
        ],
      },
      include: {
        user: true,
      },
    });
    const singleConservation = existedConservation[0];
    if (singleConservation) {
      return NextResponse.json(singleConservation);
    }

    const newConservation = await client.conservation.create({
      data: {
        user: {
          connect: [{ id: userId }, { id: session.user.id }],
        },
      },
      include: {
        user: true,
      },
    });
    newConservation.user.forEach(async (us) => {
      await pusherServer.trigger(us.id, "conservation:new", {
        newConservation: newConservation,
      });
    });
    return NextResponse.json(newConservation);
  } catch (e: any) {
    return new NextResponse("Internal error", {
      status: 501,
    });
  }
};
